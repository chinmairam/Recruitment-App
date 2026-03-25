import { LightningElement, api } from 'lwc';

export default class PortfolioSummary extends LightningElement {
    @api recordId
    @api objectApiName

    viewMode = true;

    handleEditSubmit(event){
        event.preventDefault();
        const fields = this.event.detail.fields;
        this.template,this.querySelector('lightning-record-edit-form')
        .submit(fields);
    } 

    handleEdit(){
        this.viewMode = false;
    }

    handleCancel(){
        this.viewMode = true;
    }

    handleSuccess(){
        this.viewMode = true;
    }
}