trigger FileUploadTrigger on ContentDocumentLink (after insert, after delete) {
    if(Trigger.isAfter && Trigger.isInsert){
        DocumentUploadController.docUpload(Trigger.New);
    }
}