# wa-consul-kv-sync

## Installation

```
npm i wa-consul-kv-sync
```

## Usage

```
wa-consul-kv-sync [options] [path-to-config-root] [path-to-output-file]
```

### path-to-config-root
```
    Path to configuration root.
```

### path-to-output-file
```
    Path to output file.
```

### options:

```
    -h, --help         output usage information
    -V, --version      output the version number
    --json-root        defines configuration JSON root node ("Configurations" by default)
```

### Expamples:

```
    $ wa-consul-kv-sync --json-root Config /home/wa/consul/config /home/wa/config/consul.json
```

```
    $ wa-consul-kv-sync /home/wa/consul/config /home/wa/config/consul.json
```

To view help:
```
    $ wa-consul-kv-sync -h
```

To show current version:
```
    $ wa-consul-kv-sync -V
```