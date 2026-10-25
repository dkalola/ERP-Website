# Instructions

# This will provide instructions to:

1. Add Scripts to ERP Next.
2. Update Telemetry Data to SaaS Portal
3. Backup ERP Next and store it in cloud.

# To restore your full ERPNext backup from your host PC (where Docker is running), the script needs to:

1. Copy the backup .zip file into the running Docker container.

2. Extract the backup components (database SQL dump and files archive) inside the container's backup directory.

3. Run Frappe's bench restore command inside the container to restore the database and files.

Here are the two dedicated Python scripts—one for Mac/Linux and one for Windows—designed to be run from your main computer.

## Version 1: Mac / Linux Restore Script (restore_mac_linux.py)

Save this as restore_mac_linux.py on your Mac/Linux PC:

```
import os
import sys
import subprocess
import argparse

def run_cmd(command):
    print(f"Executing: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"Error executing command: {command}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Restore ERPNext Backup into Docker Container")
    parser.add_argument("--zip", required=True, help="Path to the full ERP backup zip file")
    parser.add_argument("--container", default="frontend-python-1", help="Docker container name or ID")
    parser.add_argument("--site", default="frontend", help="ERPNext site name")

    args = parser.parse_args()

    zip_path = os.path.abspath(args.zip)
    if not os.path.exists(zip_path):
        print(f"Error: Backup zip file not found at {zip_path}")
        sys.exit(1)

    zip_name = os.path.basename(zip_path)
    container_backup_dir = f"/home/frappe/frappe-bench/sites/{args.site}/private/backups"

    print(f"\n--- Step 1: Copying backup zip to container ({args.container}) ---")
    run_cmd(f"docker cp '{zip_path}' {args.container}:{container_backup_dir}/{zip_name}")

    print(f"\n--- Step 2: Extracting backup inside container ---")
    extract_cmd = f"docker exec -it {args.container} bash -c 'cd {container_backup_dir} && unzip -o {zip_name}'"
    run_cmd(extract_cmd)

    print(f"\n--- Step 3: Finding SQL and File archives for restoration ---")
    # Find the sql.gz file inside the container backups folder
    find_sql_cmd = f"docker exec {args.container} bash -c 'ls -t {container_backup_dir}/*.sql.gz | head -n 1'"
    sql_file = subprocess.check_output(find_sql_cmd, shell=True).decode('utf-8').strip()

    # Find the matching files tar/tgz if it exists
    find_files_cmd = f"docker exec {args.container} bash -c 'ls -t {container_backup_dir}/*-files.tar | head -n 1 || true'"
    files_tar = subprocess.check_output(find_files_cmd, shell=True).decode('utf-8').strip()

    if not sql_file:
        print("Error: No database SQL backup file found in the extracted archive.")
        sys.exit(1)

    print(f"Found SQL dump: {sql_file}")
    if files_tar:
        print(f"Found files archive: {files_tar}")

    print(f"\n--- Step 4: Running bench restore on site '{args.site}' ---")
    if files_tar:
        restore_cmd = f"docker exec -it {args.container} bench --site {args.site} restore {sql_file} --with-files {files_tar}"
    else:
        restore_cmd = f"docker exec -it {args.container} bench --site {args.site} restore {sql_file}"

    run_cmd(restore_cmd)

    print("\n✅ ERPNext restoration completed successfully!")

if __name__ == "__main__":
    main()
```

How to run on Mac/Linux:

`python3 restore_mac_linux.py --zip /path/to/full_erp_backup.zip --container your_docker_container_name --site frontend`

## Version 2: Windows Restore Script (restore_windows.py)

Save this as restore_windows.py on your Windows PC:

```
import os
import sys
import subprocess
import argparse

def run_cmd(command):
    print(f"Executing: {command}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"Error executing command: {command}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Restore ERPNext Backup into Docker Container")
    parser.add_argument("--zip", required=True, help="Path to the full ERP backup zip file")
    parser.add_argument("--container", default="frontend-python-1", help="Docker container name or ID")
    parser.add_argument("--site", default="frontend", help="ERPNext site name")

    args = parser.parse_args()

    zip_path = os.path.abspath(args.zip)
    if not os.path.exists(zip_path):
        print(f"Error: Backup zip file not found at {zip_path}")
        sys.exit(1)

    zip_name = os.path.basename(zip_path)
    container_backup_dir = f"/home/frappe/frappe-bench/sites/{args.site}/private/backups"

    print(f"\n--- Step 1: Copying backup zip to container ({args.container}) ---")
    run_cmd(f'docker cp "{zip_path}" {args.container}:{container_backup_dir}/{zip_name}')

    print(f"\n--- Step 2: Extracting backup inside container ---")
    extract_cmd = f"docker exec -it {args.container} bash -c \"cd {container_backup_dir} && unzip -o {zip_name}\""
    run_cmd(extract_cmd)

    print(f"\n--- Step 3: Finding SQL and File archives for restoration ---")
    find_sql_cmd = f"docker exec {args.container} bash -c \"ls -t {container_backup_dir}/*.sql.gz | head -n 1\""
    sql_file = subprocess.check_output(find_sql_cmd, shell=True).decode('utf-8').strip()

    find_files_cmd = f"docker exec {args.container} bash -c \"ls -t {container_backup_dir}/*-files.tar | head -n 1 || true\""
    files_tar = subprocess.check_output(find_files_cmd, shell=True).decode('utf-8').strip()

    if not sql_file:
        print("Error: No database SQL backup file found in the extracted archive.")
        sys.exit(1)

    print(f"Found SQL dump: {sql_file}")
    if files_tar:
        print(f"Found files archive: {files_tar}")

    print(f"\n--- Step 4: Running bench restore on site '{args.site}' ---")
    if files_tar:
        restore_cmd = f"docker exec -it {args.container} bench --site {args.site} restore {sql_file} --with-files {files_tar}"
    else:
        restore_cmd = f"docker exec -it {args.container} bench --site {args.site} restore {sql_file}"

    run_cmd(restore_cmd)

    print("\n✅ ERPNext restoration completed successfully!")

if __name__ == "__main__":
    main()
```

How to run on Windows (Command Prompt or PowerShell):

`python restore_windows.py --zip C:\path\to\full_erp_backup.zip --container your_docker_container_name --site frontend`

(Note: Replace frontend-python-1 with your actual running Docker container name, which you can check by running docker ps on your host PC).
