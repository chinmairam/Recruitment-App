import { LightningElement, wire, api } from 'lwc';
import { createRecord, getRecord, updateRecord } from 'lightning/uiRecordApi';
import CANDIDATEPROFILE from '@salesforce/schema/CandidateProfile__c'
import TECH_SKILLS_FIELD from '@salesforce/schema/CandidateProfile__c.TechincalSkills__c';
import SOFT_SKILLS_FIELD from '@salesforce/schema/CandidateProfile__c.SoftSkills__c'
export default class PortfolioSkills extends LightningElement {
    techSkills = []
    softSkills =[]
    customValue;
    customValue1;
    addtechs;
    @api recordId
    @api objectApiName

    @wire(getRecord, {
        recordId:'$recordId',
        fields:[TECH_SKILLS_FIELD, SOFT_SKILLS_FIELD]
    })skillHandler({data, error}){
        if(data){
            console.log('Skills Data '+JSON.stringify(data));
            this.formatSkills(data)
            // const existingInfo = data.fields.TechincalSkills__c.value;
            // const updatedInfo = existingInfo + ', ' + this.addtechs;
            // updateRecord({
            //     fields:{'Id': '$recordId',
            //     TECH_SKILLS_FIELD: updatedInfo}
            // }).then(()=>{
            //     console.log('Data Updated'+updatedInfo);
            // }).catch(error=>{
            //     console.error('Error retrieving record: ', error);
            // })
        }
        if(error){
            console.error("Skills error", error)
        }
    }

    formatSkills(data){
        const {TechincalSkills__c,SoftSkills__c} = data.fields
        this.techSkills = TechincalSkills__c ? TechincalSkills__c.value.split(','):[]
        this.softSkills = SoftSkills__c ? SoftSkills__c.value.split(','):[]
    }

    handleInputChange(event){
        this.addtechs = event.target.value;
    }
    

    addTech(){
        let current = this.recordId.data.fields.TechincalSkills__c.value;
        // console.log('Current '+current);
        let newVal1= current + ', ' + this.addtechs;
        const fields = {};
        fields['Id'] = this.recordId;
        fields['TechnicalSkills__c'] = newVal1;

        const recordInput = { fields };
        updateRecord(recordInput).then(()=>{
            console.log('Record Updated'+updatedInfo);
        }).catch(error=>{
            console.error('Error retrieving record: ', error);
        })
        // getRecord({recordId:'$recordId',
        // fields:[TECH_SKILLS_FIELD, SOFT_SKILLS_FIELD]
        // }).then(result=>{
        //     const existingInfo = result.fields.TechincalSkills__c.value;
        //     const updatedInfo = existingInfo + ', ' + this.addtechs;

        //     updateRecord({
        //         fields:{'Id': '$recordId',
        //         TECH_SKILLS_FIELD: updatedInfo}
        //     }).then(()=>{
        //         console.log('Data Updated'+updatedInfo);
        //     }).catch(error=>{
        //         console.error('Error retrieving record: ', error);
        //     })
        // })
    }

    // addTechSkill(){
    //     const head = document.createElement('div');
    //     this.techSkills.appendChild(head);
    //     // document.getElementById("tec").appendChild(head);
    //     // head.innerHTML = ('<div class="tech_skill"><span contenteditable="true"></span></div>');
    // }


}