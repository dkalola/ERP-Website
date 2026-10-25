# ERP Files Management

# What Files to Focus

1. telemetry.py
2. backup.py
3. hooks.py

# Commands to use

Enable Schedular

- `bench --site frontend enable-scheduler`

Create new app

- `bench new-app system_monitor`

Install new app

- `bench --site frontend install-app system_monitor`

Restart Bench

- `bench restart`

Set Config Variables frontend

- `bench --site frontend set-config license_key "YOUR_ACTUAL_LICENSE_KEY"`
- `bench --site frontend set-config trigger_backup 1`

# telemetry.py

#### path: apps/system_monitor/system_monitor/telemetry.py

code:

```
# Copy This File to ERP Next
# first create your custom app and then copy this file to your custom app folder
# Commands which can be used
# bench --site frontend enable-scheduler
# bench new-app system_monitor
# bench --site frontend install-app system_monitor
# bench restart
# bench --site frontend set-config license_key "YOUR_ACTUAL_LICENSE_KEY"
# bench --site frontend set-config trigger_backup 1



# file to store at: apps/system_monitor/system_monitor/telemetry.py


import psutil
import frappe
import requests

@frappe.whitelist(allow_guest=True)
def send_system_telemetry():
    """Collects system health metrics and posts to telemetry endpoint matching Cloud Function contract."""
    try:
        # System resource metrics
        cpu_usage = float(psutil.cpu_percent(interval=1))
        ram = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        # ERPNext version
        try:
            import erpnext
            erpnext_version = str(erpnext.__version__)
        except ImportError:
            erpnext_version = "Not Installed"

        # Database status check
        try:
            frappe.db.sql("SELECT 1")
            database_status = "Healthy"
        except Exception:
            database_status = "Database Error"

        # Fetch license key from site config (or replace with your actual key/logic)
        license_key ="ERP-KEY-2858-8XSL"

        payload = {
            "licenseKey": license_key,
            "timestamp": frappe.utils.now(),
            "metrics": {
                "status": "active",
                "databaseStatus": database_status,
                "cpuUsagePercent": cpu_usage,
                "ramUsagePercent": float(ram.percent),
                "diskUsagePercent": float(disk.percent),
                "erpnextVersion": erpnext_version,
                "telemetryAgent": "erpnext-agent"
            }
        }

        url = "https://us-central1-erp-master-565f8.cloudfunctions.net/updateTelemetry"
        headers = {"Content-Type": "application/json"}

        response = requests.post(url, json=payload, headers=headers, timeout=10)

        if response.status_code != 200:
            frappe.log_error(title="Telemetry Post Failed", message=response.text)
            return {"status": "error", "code": response.status_code, "message": response.text}

        return {"status": "success", "response": response.json()}

    except Exception as e:
        frappe.log_error(title="Telemetry Error", message=str(e))
        return {"status": "error", "message": str(e)}
```

# backup.py

#### path: apps/system_monitor/system_monitor/backup.py

code:

```

# Copy This File to ERP Next
# first create your custom app and then copy this file to your custom app folder
# Commands which can be used
# bench --site frontend enable-scheduler
# bench new-app system_monitor
# bench --site frontend install-app system_monitor
# bench restart
# bench --site frontend set-config license_key "YOUR_ACTUAL_LICENSE_KEY"
# bench --site frontend set-config trigger_backup 1


# file to store at: apps/system_monitor/system_monitor/backup.py

import os
import hashlib
import json
import zipfile
import requests
import frappe
from frappe.utils.backups import new_backup

@frappe.whitelist(allow_guest=True)
def trigger_backup_process():
    """Generates a complete ERP backup, zips them, hashes, uploads to Firebase."""
    try:
        # Check flag in site_config.json
        should_backup = frappe.conf.get("trigger_backup")

        if not should_backup:
            return {"status": "skipped", "message": "Backup trigger flag is false in site_config.json."}

        backup_dir = frappe.get_site_path("private", "backups")
        os.makedirs(backup_dir, exist_ok=True)

        # Generate full system backup
        new_backup()

        # Find all backup files (excluding zip archives)
        all_files = [
            f for f in os.listdir(backup_dir)
            if os.path.isfile(os.path.join(backup_dir, f)) and not f.endswith('.zip')
        ]

        if not all_files:
            return {"status": "error", "message": "No backup files found in directory."}

        # Sort files by modification time descending (newest first)
        all_files.sort(key=lambda x: os.path.getmtime(os.path.join(backup_dir, x)), reverse=True)

        # Frappe backups generated in the same batch share the exact timestamp prefix (first 15 chars: YYYYMMDD_HHMMSS)
        latest_file = all_files[0]
        timestamp_prefix = latest_file[:15]

        batch_files = [f for f in all_files if f.startswith(timestamp_prefix)]

        if not batch_files:
            return {"status": "error", "message": "No matching backup batch found."}

        # Package the batch into a single master zip file
        timestamp_str = frappe.utils.now_datetime().strftime("%Y%m%d_%H%M%S")
        master_zip_name = f"full_erp_backup_{timestamp_str}.zip"
        master_zip_path = os.path.join(backup_dir, master_zip_name)

        with zipfile.ZipFile(master_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for fname in batch_files:
                fpath = os.path.join(backup_dir, fname)
                zipf.write(fpath, arcname=fname)

        # Calculate SHA-256 Hash of the master zip
        file_hash = get_file_hash(master_zip_path)

        # Upload to Firebase Storage
        license_key = frappe.conf.get("license_key")
        if not license_key:
            return {"status": "error", "message": "license_key is missing in site_config.json"}

        upload_url = "https://us-central1-erp-master-565f8.cloudfunctions.net/uploadBackup"

        with open(master_zip_path, "rb") as f:
            files_payload = {"file": (master_zip_name, f, "application/zip")}
            data_payload = {"licenseKey": license_key, "fileHash": file_hash}

            response = requests.post(upload_url, data=data_payload, files=files_payload, timeout=300)

        if response.status_code != 200:
            frappe.log_error(title="Backup Upload Failed", message=response.text)
            return {"status": "error", "message": f"Firebase Error ({response.status_code}): {response.text}"}

        # Clean up local master zip to save server storage
        try:
            os.remove(master_zip_path)
        except Exception:
            pass

        # Update site_config.json directly
        completion_time = frappe.utils.now()
        config_path = frappe.get_site_path("site_config.json")

        with open(config_path, "r") as f:
            site_config = json.load(f)

        site_config["trigger_backup"] = 0
        site_config["last_backup_hash"] = file_hash
        site_config["last_backup_time"] = completion_time

        with open(config_path, "w") as f:
            json.dump(site_config, f, indent=4)

        return {
            "status": "success",
            "filename": master_zip_name,
            "hash": file_hash,
            "timestamp": completion_time
        }

    except Exception as e:
        frappe.log_error(title="Backup Process Error", message=str(e))
        return {"status": "error", "message": str(e)}

def get_file_hash(file_path):
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()
```

Note:

- This code will check the frontend site config file.

# hooks.py

#### path: apps/system_monitor/system_monitor/hooks.py

add this code to the file:

```
scheduler_events = {
    "daily": [
        "server.telemetry.send_system_telemetry",
        "server.backup.trigger_backup_process"
    ]
}
```

(Note: If you want the backup check to run more frequently—such as every hour to catch triggers faster—you can move trigger_backup_process to "hourly" instead of "daily").
