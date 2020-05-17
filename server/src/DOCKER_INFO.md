# Informational Dockerode Structures

## ContainerInfo

ContainerInfo:
  {
    "Id": "38db43acae8ca9c45a703265d6c39ea5e703daa32bdb096ab2cd755ab69d5c07",
    "Names": [
      "/dazzling_merkle"
    ],
    "Image": "hello-webserver",
    "ImageID": "sha256:65b00417795a15e723022550b655a21afe91d3618cc107087901fd27ff7589f3",
    "Command": "docker-entrypoint.sh npm start",
    "Created": 1584258304,
    "Ports": [
      {
        "IP": "0.0.0.0",
        "PrivatePort": 4000,
        "PublicPort": 40001,
        "Type": "tcp"
      }
    ],
    "Labels": {},
    "State": "running",
    "Status": "Up 41 minutes",
    "HostConfig": {
      "NetworkMode": "default"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {
          "IPAMConfig": null,
          "Links": null,
          "Aliases": null,
          "NetworkID": "9571f85f1cb12911ecdb5abdf5fe33625b59dcacca551f1c5378c4f606f2bcae",
          "EndpointID": "cccda0bac6450c54c75d79d62bb9a220226325bc1925210502fe751981e54ffb",
          "Gateway": "172.17.0.1",
          "IPAddress": "172.17.0.2",
          "IPPrefixLen": 16,
          "IPv6Gateway": "",
          "GlobalIPv6Address": "",
          "GlobalIPv6PrefixLen": 0,
          "MacAddress": "02:42:ac:11:00:02",
          "DriverOpts": null
        }
      }
    },
    "Mounts": []
  }

## Container inspect

Container inspect has more detail than ContainerInfo

.Config.Env:["name=2"]
{
  "Id": "52eaabdf30eca8c2588f0f992a02f86e84fce1f2b64e67dd3e4303bc7e085701",
  "Created": "2020-04-10T21:59:01.004389209Z",
  "Path": "docker-entrypoint.sh",
  "Args": [
    "npm",
    "start"
  ],
  "State": {
    "Status": "running",
    "Running": true,
    "Paused": false,
    "Restarting": false,
    "OOMKilled": false,
    "Dead": false,
    "Pid": 1830,
    "ExitCode": 0,
    "Error": "",
    "StartedAt": "2020-04-10T21:59:01.487062709Z",
    "FinishedAt": "0001-01-01T00:00:00Z"
  },
  "Image": "sha256:65b00417795a15e723022550b655a21afe91d3618cc107087901fd27ff7589f3",
  "ResolvConfPath": "/var/lib/docker/containers/52eaabdf30eca8c2588f0f992a02f86e84fce1f2b64e67dd3e4303bc7e085701/resolv.conf",
  "HostnamePath": "/var/lib/docker/containers/52eaabdf30eca8c2588f0f992a02f86e84fce1f2b64e67dd3e4303bc7e085701/hostname",
  "HostsPath": "/var/lib/docker/containers/52eaabdf30eca8c2588f0f992a02f86e84fce1f2b64e67dd3e4303bc7e085701/hosts",
  "LogPath": "/var/lib/docker/containers/52eaabdf30eca8c2588f0f992a02f86e84fce1f2b64e67dd3e4303bc7e085701/52eaabdf30eca8c2588f0f992a02f86e84fce1f2b64e67dd3e4303bc7e085701-json.log",
  "Name": "/kind_cori",
  "RestartCount": 0,
  "Driver": "overlay2",
  "Platform": "linux",
  "MountLabel": "",
  "ProcessLabel": "",
  "AppArmorProfile": "",
  "ExecIDs": null,
  "HostConfig": {
    "Binds": null,
    "ContainerIDFile": "",
    "LogConfig": {
      "Type": "json-file",
      "Config": {}
    },
    "NetworkMode": "default",
    "PortBindings": {
      "4000/tcp": [
        {
          "HostIp": "0.0.0.0",
          "HostPort": "48128"
        }
      ]
    },
    "RestartPolicy": {
      "Name": "",
      "MaximumRetryCount": 0
    },
    "AutoRemove": false,
    "VolumeDriver": "",
    "VolumesFrom": null,
    "CapAdd": null,
    "CapDrop": null,
    "Capabilities": null,
    "Dns": null,
    "DnsOptions": null,
    "DnsSearch": null,
    "ExtraHosts": null,
    "GroupAdd": null,
    "IpcMode": "private",
    "Cgroup": "",
    "Links": null,
    "OomScoreAdj": 0,
    "PidMode": "",
    "Privileged": false,
    "PublishAllPorts": false,
    "ReadonlyRootfs": false,
    "SecurityOpt": null,
    "UTSMode": "",
    "UsernsMode": "",
    "ShmSize": 67108864,
    "Runtime": "runc",
    "ConsoleSize": [
      0,
      0
    ],
    "Isolation": "",
    "CpuShares": 0,
    "Memory": 0,
    "NanoCpus": 0,
    "CgroupParent": "",
    "BlkioWeight": 0,
    "BlkioWeightDevice": null,
    "BlkioDeviceReadBps": null,
    "BlkioDeviceWriteBps": null,
    "BlkioDeviceReadIOps": null,
    "BlkioDeviceWriteIOps": null,
    "CpuPeriod": 0,
    "CpuQuota": 0,
    "CpuRealtimePeriod": 0,
    "CpuRealtimeRuntime": 0,
    "CpusetCpus": "",
    "CpusetMems": "",
    "Devices": null,
    "DeviceCgroupRules": null,
    "DeviceRequests": null,
    "KernelMemory": 0,
    "KernelMemoryTCP": 0,
    "MemoryReservation": 0,
    "MemorySwap": 0,
    "MemorySwappiness": null,
    "OomKillDisable": false,
    "PidsLimit": null,
    "Ulimits": null,
    "CpuCount": 0,
    "CpuPercent": 0,
    "IOMaximumIOps": 0,
    "IOMaximumBandwidth": 0,
    "MaskedPaths": [
      "/proc/asound",
      "/proc/acpi",
      "/proc/kcore",
      "/proc/keys",
      "/proc/latency_stats",
      "/proc/timer_list",
      "/proc/timer_stats",
      "/proc/sched_debug",
      "/proc/scsi",
      "/sys/firmware"
    ],
    "ReadonlyPaths": [
      "/proc/bus",
      "/proc/fs",
      "/proc/irq",
      "/proc/sys",
      "/proc/sysrq-trigger"
    ]
  },
  "GraphDriver": {
    "Data": {
      "LowerDir": "/var/lib/docker/overlay2/9531cec6dbbed2074eda72828ae8d95784f5b33205bd1e2f348eb991971d88cf-init/diff:/var/lib/docker/overlay2/bd509e9872a735f166ecd810a9fae4d62807ada49abda8e3962eecb78074bda3/diff:/var/lib/docker/overlay2/392aeec2af734710a104c1bf918c2c8e53bfde622227eb2e3ce39f53719f0b76/diff:/var/lib/docker/overlay2/0e274f0af274eab3227e11a1f4a7f5fdf47e08dc8eaf403b53bb9b9ff3a5fc1d/diff:/var/lib/docker/overlay2/205f2cce13a0fdebc7c79cc811a007d5dcf77978387f504507f52a4d65e26324/diff:/var/lib/docker/overlay2/7b43e41aaa64a049fa8f5084243da401d4d54f7a45a3fdf9a054a0f67713cde9/diff:/var/lib/docker/overlay2/1fbfd256c4ce26b17a045159e9793aff10fa71ed088827ddb53c0ebfba182fba/diff:/var/lib/docker/overlay2/4ce3020251d7082717a35835ee9bbd89bbe71eaef3126a958060030e4b24b8fc/diff:/var/lib/docker/overlay2/3e278944229640751f46755b1a5d19aabd394c669a2980fa3fb340587fa199a0/diff:/var/lib/docker/overlay2/1f9b212d96e3888be45ce90e4ad966ffbf588f17400486189fa7dbad32d4b604/diff:/var/lib/docker/overlay2/b0f3ae340cd4eaf381b1f1d3e71e294a244ab5acc513f1c56fe315138babe8fe/diff:/var/lib/docker/overlay2/885d26fd12babe4d17b01c6a5bacfe375473bd434a3168d8866dfa3f3c7250d6/diff",
      "MergedDir": "/var/lib/docker/overlay2/9531cec6dbbed2074eda72828ae8d95784f5b33205bd1e2f348eb991971d88cf/merged",
      "UpperDir": "/var/lib/docker/overlay2/9531cec6dbbed2074eda72828ae8d95784f5b33205bd1e2f348eb991971d88cf/diff",
      "WorkDir": "/var/lib/docker/overlay2/9531cec6dbbed2074eda72828ae8d95784f5b33205bd1e2f348eb991971d88cf/work"
    },
    "Name": "overlay2"
  },
  "Mounts": [],
  "Config": {
    "Hostname": "52eaabdf30ec",
    "Domainname": "",
    "User": "",
    "AttachStdin": false,
    "AttachStdout": false,
    "AttachStderr": false,
    "ExposedPorts": {
      "4000/tcp": {}
    },
    "Tty": false,
    "OpenStdin": false,
    "StdinOnce": false,
    "Env": [
      "name=2",
      "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      "NODE_VERSION=13.7.0",
      "YARN_VERSION=1.21.1",
      "DEBUG=*error,sta,idx,pro,stp,mac,plc,opc,aut,doc,log,ppg,ppb"
    ],
    "Cmd": [
      "npm",
      "start"
    ],
    "Image": "hello-webserver",
    "Volumes": null,
    "WorkingDir": "/usr/src/app/server",
    "Entrypoint": [
      "docker-entrypoint.sh"
    ],
    "OnBuild": null,
    "Labels": {}
  },
  "NetworkSettings": {
    "Bridge": "",
    "SandboxID": "d28ebbb46ba1ba051450f0059bf3488377b24bdf731add295e61463493f80cf0",
    "HairpinMode": false,
    "LinkLocalIPv6Address": "",
    "LinkLocalIPv6PrefixLen": 0,
    "Ports": {
      "4000/tcp": [
        {
          "HostIp": "0.0.0.0",
          "HostPort": "48128"
        }
      ]
    },
    "SandboxKey": "/var/run/docker/netns/d28ebbb46ba1",
    "SecondaryIPAddresses": null,
    "SecondaryIPv6Addresses": null,
    "EndpointID": "b416e847c7c70174b888b66a8cc9c2043002b34cf92e8cc1b43e2adec494a221",
    "Gateway": "172.17.0.1",
    "GlobalIPv6Address": "",
    "GlobalIPv6PrefixLen": 0,
    "IPAddress": "172.17.0.3",
    "IPPrefixLen": 16,
    "IPv6Gateway": "",
    "MacAddress": "02:42:ac:11:00:03",
    "Networks": {
      "bridge": {
        "IPAMConfig": null,
        "Links": null,
        "Aliases": null,
        "NetworkID": "277f7860cc9565962b858b49bf979ed69ba5d9d6ee3baa5d07cfdc469b999ff6",
        "EndpointID": "b416e847c7c70174b888b66a8cc9c2043002b34cf92e8cc1b43e2adec494a221",
        "Gateway": "172.17.0.1",
        "IPAddress": "172.17.0.3",
        "IPPrefixLen": 16,
        "IPv6Gateway": "",
        "GlobalIPv6Address": "",
        "GlobalIPv6PrefixLen": 0,
        "MacAddress": "02:42:ac:11:00:03",
        "DriverOpts": null
      }
    }
  }
}