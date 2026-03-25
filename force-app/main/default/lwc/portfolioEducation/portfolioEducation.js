import { LightningElement, wire, api } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


const COLUMNS = [
    { label: 'Institution Name', fieldName: 'Name', editable: true },
    { label: 'Passing Year', fieldName: 'Passing_Year__c', editable: true },
    { label: 'Title', fieldName: 'Title__c', editable: true }
];
export default class PortfolioEducation extends LightningElement {
    tableData;
    columns = COLUMNS
    draftValues = []
    rowOffset = 0;
    @api recordId

    @wire(getRelatedListRecords, {
        parentRecordId:"$recordId",
        relatedListId:'Educations__r',
        fields:['Education__c.Name','Education__c.Title__c','Education__c.Passing_Year__c'],
        sortBy:['Education__c.Passing_Year__c']
    })EducationHandler({data, error}){
        if(data){
            console.log("EducationHandler data", JSON.stringify(data));
            console.log(data);
            //this.formatData(data)
            this.tableData = data.records.map(record=>{
                return {
                    Name: record.fields.Name.value,
                    Passing_Year__c: record.fields.Passing_Year__c.value,
                    Title__c: record.fields.Title__c.value,
                    Id: record.id
                };
            })
            console.log("this.tableData", JSON.stringify(this.tableData))
        }
        if(error){
            console.error("EducationHandler error", error)
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
                        message: 'Records updated',
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