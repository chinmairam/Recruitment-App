import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from "@salesforce/apex";
import getCandidateId from '@salesforce/apex/setRecordId.getCandidateId';
import Id from '@salesforce/user/Id';
import getFileVersions from "@salesforce/apex/FileController.getVersionFiles";

export default class FileUpload extends LightningElement {
    loaded = false;
    @track fileList;
    @track files = [];

    @api relatedRecordId;
    relatedRecordBool = false;

    @wire(getCandidateId, {
        userId: Id
    })
    wiredRecordId({ error, data }) {
        if (data) {
            // eslint-disable-next-line @lwc/lwc/no-api-reassignments
            this.relatedRecordId = data;
            this.relatedRecordBool = true;
        } else if (error) {
            // Handle error
            console.error(error);
        }
    }

    // get acceptedFormats() {
    //     return [".pdf", ".png", ".jpg", ".jpeg"];
    // }

    @wire(getFileVersions, { recordId: "$relatedRecordId" })
    fileResponse(value) {
        this.wiredActivities = value;
        const { data, error } = value;
        this.fileList = "";
        this.files = [];
        if (data) {
        this.fileList = data;
        for (let i = 0; i < this.fileList.length; i++) {
            let file = {
            Id: this.fileList[i].Id,
            Title: this.fileList[i].Title,
            Extension: this.fileList[i].FileExtension,
            ContentDocumentId: this.fileList[i].ContentDocumentId,
            ContentDocument: this.fileList[i].ContentDocument,
            CreatedDate: this.fileList[i].CreatedDate,
            thumbnailFileCard:
                "/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=" +
                this.fileList[i].Id +
                "&operationContext=CHATTER&contentId=" +
                this.fileList[i].ContentDocumentId
            };
            this.files.push(file);
        }
        this.loaded = true;
        } else if (error) {
        this.dispatchEvent(
            new ShowToastEvent({
            title: "Error loading Files",
            message: error.body.message,
            variant: "error"
            })
        );
        }
    }

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        refreshApex(this.wiredActivities);
        let noOfFiles = uploadedFiles.length;
        this.dispatchEvent(
            new ShowToastEvent( {
                title: 'Doc Upload',
                message: noOfFiles + ' Doc Uploaded Successfully!!!',
                variant: 'success'
            } ),
        );
    }
}
