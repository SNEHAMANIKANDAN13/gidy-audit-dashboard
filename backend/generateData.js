const fs = require("fs");

const actions = ["DELETE_USER", "CREATE_USER", "UPDATE_ROLE", "LOGIN", "LOGOUT", "VIEW_RECORD", "EXPORT_DATA"];
const roles = ["admin", "manager", "employee", "auditor"];
const severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const statuses = ["Resolved", "Unresolved"];
const regions = ["ap-south-1", "us-east-1", "eu-west-1", "ap-southeast-1"];
const resourceTypes = ["USER", "FILE", "DATABASE", "API_KEY", "ROLE"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomIP() {
  return `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}
function randomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date(2026, 6, 21);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const logs = [];
for (let i = 0; i < 10000; i++) {
  logs.push({
    actor: `user${i % 500}@company.com`,
    role: randomItem(roles),
    action: randomItem(actions),
    resource: `/api/users/${i}`,
    resourceType: randomItem(resourceTypes),
    ipAddress: randomIP(),
    region: randomItem(regions),
    severity: randomItem(severities),
    status: randomItem(statuses),
    timestamp: randomDate(),
  });
}

fs.writeFileSync("testLogs.json", JSON.stringify({ logs }, null, 2));
console.log("10,000 fake logs generated in testLogs.json");