import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MedicalRecordsModule", (m) => {
  // Create a contract deployment
  const medicalRecords = m.contract("MedicalRecords");

  // Optional: add a test record immediately after deployment
  const testUserId = "patient001";
  const testDbUrl = "firestore://medical_reports/test123";
  const testTimestamp = BigInt(Math.floor(Date.now() / 1000));

  m.call(medicalRecords, "addMedicalRecord", [testUserId, testDbUrl, testTimestamp]);

  // Return the deployed contract so it can be referenced elsewhere
  return { medicalRecords };
});
