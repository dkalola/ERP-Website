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