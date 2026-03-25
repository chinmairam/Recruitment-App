import { LightningElement, api, wire, track } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { NavigationMixin } from "lightning/navigation";

export default class MyResumeExperience1 extends NavigationMixin(LightningElement) {
    @api details
    @api recordId
    @api objectApiName
    @api showActions;
    showActions = true;
    tableData = []
    draftValues = []
    rowOffset = 0;
    Duration;

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
                    Id: record.id,
                    Duration: (record.fields.IsCurrent__c.value == true) ? 
                    (record.fields.JobStartDate__c.value + ' - ' + 'Current') :
                    (record.fields.JobStartDate__c.value + ' - ' + record.fields.JobEndDate__c.value)
                };
            })
        }
        if(error){
            console.error("Work Experience Error ",error);
        }
    }

    handleEdit() {
        this[NavigationMixin.Navigate](
            {
                type: "standard__recordRelationshipPage",
                attributes: {
                    recordId: this.recordId,
                    relationshipApiName: "WorkExperience__r",
                    actionName: "view"
                }
            }
        );
    }
}