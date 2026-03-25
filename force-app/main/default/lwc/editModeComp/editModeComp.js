// myButtonComponent.js
import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class EditModeComp extends NavigationMixin(LightningElement) {
    @api recordId;

    handleEditClick() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                componentName: 'c__myResumeContainer1'
            }
        });
    }
}
