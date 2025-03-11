import os
import sys
import platform
from pathlib import Path

print("Python version:", platform.python_version())

platform_mapping = {
    "win32": "windows",
    "linux": "linux",
    "darwin": "macosx",
}

machine_map = {
    'win32': 'x86_64',
    'amd64': 'x86_64',
    'x86_64': 'x86_64',
    'arm_64': 'arm_64',
    'aarch64': 'arm_64',
    'mips64': 'mips_64'
}


def get_machine():
    machine = platform.machine()
    if machine:
        return machine
    else:
        return sys.platform


def get_system_version():
    import subprocess
    command = 'wmic os get Caption'

    try:
        output = subprocess.check_output(command, shell=True)
        lines = str(output).split('\\n')
        if len(lines) > 1:
            system_version = lines[1].strip()
            if '11' in system_version:
                return '11'
            elif '10' in system_version:
                return '10'
            elif '7' in system_version:
                return '7'
            elif 'Windows Server 2022 Datacenter' in system_version:
                return 'Windows Server 2022 Datacenter'
            elif 'Windows Server 2016 Datacenter' in system_version:
                return 'Windows Server 2016 Datacenter'
            else:
                return 'Unknown'
    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
    return 'Unknown'


operating_system = platform_mapping[sys.platform]
architecture = machine_map[get_machine().lower()]

if sys.platform == "win32":
    # fix windows registry stuff
    import mimetypes
    mimetypes.add_type('application/javascript', '.js')
    mimetypes.add_type('text/css', '.css')
    sys.path.insert(0, os.path.join(
        os.getcwd(), "platform_site_packages", "x86_64_windows"))
elif sys.platform == "darwin":
    pass
elif sys.platform == "linux":
    target_dir = "{}_{}".format(architecture, operating_system)
    sys.path.insert(0, os.path.join(
        os.getcwd(), "platform_site_packages", target_dir))


sys.path.insert(1, os.path.join(os.getcwd(), "site_packages"))
sys.path.insert(2, os.path.join(os.getcwd(), "webrunner_site_packages"))

if __name__ == '__main__':
    from route_app import start_application
    start_application()
