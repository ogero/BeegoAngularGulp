package components

import (
	"github.com/astaxie/beego/logs"
	"os/exec"
	"regexp"
	"github.com/fsnotify/fsnotify"
	"fmt"
	"os"
	"time"
	"path/filepath"
	"strings"
	"bytes"
)

type mError struct {
	cause   error
	message string
}

func (e mError) Error() string {
	return fmt.Sprintf("%s\n%s", e.cause, e.message)
}

var (
	eventTime = make(map[string]int64)
	scheduleTime time.Time
)

func AssetsPacker(packImmediate bool, minify bool, watchForAssetsChanges bool, watchPaths []string, watchRegEx string) {
	var err error
	if err = ensureNPMPackages(); err != nil {
		logs.Error(err.Error())
		return
	}
	if watchForAssetsChanges {
		if err = setupWatchers(minify, watchPaths, watchRegEx); err != nil {
			logs.Error(err.Error())
		} else {
			logs.Info("All Assets watchers initialized")
		}
	}
	if packImmediate {
		if err = pack(minify, "packImmediate = true"); err != nil {
			logs.Error(err.Error())
		}
	}
}

func setupWatchers(minify bool, watchPaths []string, watchRegEx string) error {
	var err error
	var cwd string
	var regExp *regexp.Regexp
	var watcher *fsnotify.Watcher
	if cwd, err = os.Getwd(); err != nil {
		return mError{err, "Could not obtain current working dir"}
	}
	if regExp, err = regexp.Compile(watchRegEx); err != nil {
		return mError{err, "Could not compile regular expression: " + watchRegEx}
	}
	if watcher, err = fsnotify.NewWatcher(); err != nil {
		return mError{err, "Failed to create a new watcher"}
	}
	go func() {
		for {
			select {
			case e := <-watcher.Events:
				if regExp.MatchString(e.Name) {
					now := time.Now().Unix()
					lastMod := eventTime[e.Name]
					eventTime[e.Name] = now
					if lastMod < now - 2 {
						go func() {
							// Wait 1s before autobuild util there is no file change.
							scheduleTime = time.Now().Add(1 * time.Second)
							time.Sleep(scheduleTime.Sub(time.Now()))
							if err = pack(minify, e.Name); err != nil {
								logs.Error(err.Error())
							}
						}()
					}
				}
			case err := <-watcher.Errors:
				logs.Error("Watcher error: " + err.Error())
			}
		}
	}()
	for _, path := range watchPaths {
		fullPath := fmt.Sprintf("%s%c%s", cwd, os.PathSeparator, path)
		if err = watchRecursive(watcher, fullPath, false); err != nil {
			logs.Error("Failed to watch directory " + fullPath + " -> " + err.Error())
		}
		if err != nil {
			return mError{err, "Failed to watch at least one path"}
		}
	}
	return nil
}

func pack(production bool, because string) error {
	var outbuf, errbuf bytes.Buffer
	var err error
	params := []string{}
	if production {
		params = append(params, "--production")
	}
	logs.Info("Pack triggered by " + because)
	logs.Info(">gulp " + strings.Join(params, " "))
	cmd := exec.Command("gulp", params...)
	cmd.Stderr = &errbuf
	cmd.Stdout = &outbuf
	if err = cmd.Run(); err != nil {
		return mError{err, errbuf.String() + outbuf.String()}
	} else {
		logs.Info(errbuf.String() + outbuf.String())
	}
	return nil
}

func ensureNPMPackages() error {
	var outbuf, errbuf bytes.Buffer
	var err error
	for _, npmParam := range []string{"install"} {
		logs.Info(">npm " + npmParam)
		cmd := exec.Command("npm", npmParam)
		cmd.Stderr = &errbuf
		cmd.Stdout = &outbuf
		if err = cmd.Run(); err != nil {
			return mError{err, errbuf.String() + outbuf.String()}
		}
	}
	return nil
}

func watchRecursive(watcher *fsnotify.Watcher, path string, unWatch bool) error {
	err := filepath.Walk(path, func(walkPath string, fi os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		var p string
		if os.PathSeparator == '/' {
			p = filepath.ToSlash(walkPath)
		} else {
			p = filepath.FromSlash(walkPath)
		}
		if fi.IsDir() {
			if unWatch {
				if err = watcher.Remove(p); err != nil {
					return err
				}
			} else {
				logs.Info("Watching: " + p)
				if err = watcher.Add(p); err != nil {
					return err
				}
			}
		}
		return nil
	})
	return err
}
