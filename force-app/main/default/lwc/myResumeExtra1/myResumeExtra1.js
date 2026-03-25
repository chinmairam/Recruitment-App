import { LightningElement, wire, api } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { NavigationMixin } from "lightning/navigation";
import SOCIAL from '@salesforce/resourceUrl/SOCIAL';

export default class MyResumeExtra1 extends NavigationMixin(LightningElement) {
    @api details
    @api recordId
    @api objectApiName
    @api showActions;
    showActions = true;
    tableData = []

    ICON = SOCIAL + '/SOCIAL/education.svg';
    
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
        }
        if(error){
            console.error("EducationHandler error", error)
        }
    }

    handleEdit() {
        this[NavigationMixin.Navigate](
            {
                type: "standard__recordRelationshipPage",
                attributes: {
                    recordId: this.recordId,
                    relationshipApiName: "Educations__r",
                    actionName: "view"
                }
            }
        );
    }
}
