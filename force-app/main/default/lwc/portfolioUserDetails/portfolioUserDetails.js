import { LightningElement, api, track } from 'lwc';

export default class PortfolioUserDetails extends LightningElement {
    @api recordId
    @api objectApiName
    @track isEditMode = false;
    @track buttonLabel = 'Edit'; 
    viewMode = true;

    handleEditSubmit(event){
        event.preventDefault();
        const fields = this.event.detail.fields;
        this.template,this.querySelector('lightning-record-edit-form')
        .submit(fields);
        this.toggleMode();
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

    toggleMode(){
        this.isEditMode = !this.isEditMode;
        console.log(this.isEditMode);
        this.buttonLabel = this.isEditMode ? 'Cancel':'Edit';
    }
}