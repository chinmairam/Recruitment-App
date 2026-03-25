import { LightningElement, wire, api } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const COLUMNS = [
    { label: 'Company Name', fieldName: 'Company_Name__c', editable: true },
    { label: 'Work Location', fieldName: 'Work_Location__c', editable: true },
    { label: 'Role', fieldName: 'Role__c', editable: true },
    { label: 'Job Start Date', fieldName: 'JobStartDate__c', editable: true },
    { label: 'Job End Date', fieldName: 'JobEndDate__c', editable: true },
    { label: 'Is Current', fieldName: 'IsCurrent__c', editable: true },
    { label: 'Description', fieldName: 'Description__c', editable: true }
];
export default class PortfolioWork extends LightningElement {
    tableData = []
    columns = COLUMNS
    draftValues = []
    rowOffset = 0;
    @api recordId
    @wire(getRelatedListRecords, {
        parentRecordId:'$recordId',
        relatedListId:'WorkExperience__r',
        fields:['Work_Experience__c.JobStartDate__c',
        'Work_Experience__c.JobEndDate__c',
        'Work_Experience__c.Role__c',
        'Work_Experience__c.Company_Name__c',
        'Work_Experience__c.Work_Location__c',
        'Work_Experience__c.Description__c',
        'Work_Experience__c.IsCurrent__c'
        ],
        sortBy:['Work_Experience__c.JobStartDate__c']
    })WorkExperienceHandler({data, error}){
        if(data){
            console.log("WorkExperience Data New", JSON.stringify(data))
            this.tableData = data.records.map(record=>{
                return {
                    Company_Name__c: record.fields.Company_Name__c.value,
                    Work_Location__c: record.fields.Work_Location__c.value,
                    Role__c: record.fields.Role__c.value,
                    JobStartDate__c: record.fields.JobStartDate__c.value,
                    JobEndDate__c: record.fields.JobEndDate__c.value,
                    IsCurrent__c: record.fields.IsCurrent__c.value,
                    Description__c: record.fields.Description__c.value,
                    Id: record.id
                };
            })
        }
        if(error){
            console.error("Work Experience Error ",error);
        }
    }

    handleSave(event){
        const updatedFields = event.detail.draftValues;
        updatedFields.forEach(updateField => {
            const recordInput = { fields: {...updateField, Id: updateField.Id}};
            updateRecord(recordInput).then(()=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record updated',
                        variant: 'success'
                    })
                );
                this.draftValues = [];
                return refreshApex(this.tableData);
            }).catch(error => {
                console.log('Error '+JSON.stringify(error));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
        });
    }
}