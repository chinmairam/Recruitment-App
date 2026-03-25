public class DocumentUploadController {
  public static void docUpload(List<ContentDocumentLink> newRecords){
      // Get the IDs of the linked entities
      Set<Id> linkedEntityIds = new Set<Id>();
      for (ContentDocumentLink cdl : newRecords) {
        linkedEntityIds.add(cdl.LinkedEntityId);
      }
      // Query the CandidateProfile records that are linked to the files
      Map<Id, CandidateProfile__c> candidateProfiles = new Map<Id, CandidateProfile__c>(
        [SELECT Id, FileUploaded__c, Verification_Status__c FROM CandidateProfile__c WHERE Id IN :linkedEntityIds]
      );
      // Create a list of approval requests
      List<Approval.ProcessSubmitRequest> approvalRequests = new List<Approval.ProcessSubmitRequest>();
      // Loop through the CandidateProfile records
      for (CandidateProfile__c cp : candidateProfiles.values()) {
        // Increment the FileUploaded__c field and clear the Verification_Status__c field
        cp.FileUploaded__c = cp.FileUploaded__c == null ? 1 : cp.FileUploaded__c + 1;
        cp.Verification_Status__c = 'Pending';
        // Create an approval request for each record
        Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
        req.setComments('Submitting request for document approval');
        req.setObjectId(cp.Id);
        // Add the request to the list
        approvalRequests.add(req);
      }
      // Update the CandidateProfile records
      update candidateProfiles.values();
      // Submit the approval requests
      Approval.ProcessResult[] approvalResults = Approval.process(approvalRequests);
  }
}
