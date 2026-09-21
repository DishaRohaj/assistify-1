function AdminConfig() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Configuration</h1>
            <p className="text-gray-500 text-sm mb-6">System categories, priorities, and SLA settings.</p>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-xl">
                <p className="text-sm text-gray-600 mb-4">
                    Categories and priorities are currently fixed in the system (Network, Email, Hardware, Software,
                    Access & Accounts, Other / Low, Medium, High) and SLA targets are set automatically based on priority
                    (High = 4h, Medium = 8h, Low = 24h).
                </p>
                <p className="text-sm text-gray-500">
                    Making these editable from this screen is a planned enhancement — for now, changes to categories,
                    priorities, or SLA targets require a code change.
                </p>
            </div>
        </div>
    )
}

export default AdminConfig