gradleps
=====================

Npm-style search through Maven Central repository and easy adding dependencies to Gradle buildfile.

## Installation & Usage
```bash
$ npm install gradleps -g
```

After installation you can search through Maven Central
```bash
$ gradleps search guice --limit 5
Found 296 results. Displaying first 5:
  com.google.inject:guice 4.0-beta
  com.jolira:guice 3.0.0
  org.jvnet.hudson:guice 3.0-rc1
  com.mycila.com.google.inject:guice 3.0-20100927
  org.mod4j.com.google.inject:guice 1.0-XTEXT-PATCHED

```

You can also automatically update your `build.gradle` file.
```bash
$ gradleps install guice -f build.gradle 
Possible options:
 [y]  com.google.inject:guice 4.0-beta
 [1]  com.jolira:guice 3.0.0
 [2]  org.jvnet.hudson:guice 3.0-rc1
 [3]  com.mycila.com.google.inject:guice 3.0-20100927
 [4]  org.mod4j.com.google.inject:guice 1.0-XTEXT-PATCHED
 
Installing com.google.inject:guice@4.0-beta
Is it okay? [Y/n/1/2/3/4] choice  Y
All done!
```

## Changelog
0.0.4 - Fixed shebang to more generic (thanks to fbukevin)
0.0.3 - Just print the dependency if dependencies cannot be found.

## Contribution
Any contribution is welcome. Please share your ideas!
