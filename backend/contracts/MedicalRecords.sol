// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MedicalRecords
 * @dev Store medical record references on Polygon blockchain
 */
contract MedicalRecords {
    
    struct MedicalRecord {
        string userId;
        string dbUrl;
        uint256 timestamp;
        address creator;
    }
    
    // Mapping from record ID to MedicalRecord
    mapping(uint256 => MedicalRecord) public records;
    
    // Counter for record IDs
    uint256 public recordCount;
    
    // Event emitted when a new record is added
    event MedicalRecordAdded(
        uint256 indexed recordId,
        string userId,
        string dbUrl,
        uint256 timestamp,
        address indexed creator
    );
    
    /**
     * @dev Add a new medical record reference
     * @param userId The ID of the user/patient
     * @param dbUrl The database URL where the encrypted report is stored
     * @param timestamp The timestamp of the record creation
     * @return The ID of the newly created record
     */
    function addMedicalRecord(
        string memory userId,
        string memory dbUrl,
        uint256 timestamp
    ) public returns (uint256) {
        recordCount++;
        uint256 newRecordId = recordCount;
        
        records[newRecordId] = MedicalRecord({
            userId: userId,
            dbUrl: dbUrl,
            timestamp: timestamp,
            creator: msg.sender
        });
        
        emit MedicalRecordAdded(
            newRecordId,
            userId,
            dbUrl,
            timestamp,
            msg.sender
        );
        
        return newRecordId;
    }
    
    /**
     * @dev Get a medical record by ID
     * @param recordId The ID of the record to retrieve
     * @return userId The user ID
     * @return dbUrl The database URL
     * @return timestamp The record timestamp
     */
    function getMedicalRecord(uint256 recordId) 
        public 
        view 
        returns (
            string memory userId,
            string memory dbUrl,
            uint256 timestamp
        ) 
    {
        require(recordId > 0 && recordId <= recordCount, "Invalid record ID");
        
        MedicalRecord memory record = records[recordId];
        return (record.userId, record.dbUrl, record.timestamp);
    }
    
    /**
     * @dev Get the total number of records
     * @return The total record count
     */
    function getTotalRecords() public view returns (uint256) {
        return recordCount;
    }
}
