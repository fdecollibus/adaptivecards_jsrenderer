var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as AC from "adaptivecards";
export class ProgressBar extends AC.CardElement {
    get title() {
        return this.getValue(ProgressBar.titleProperty);
    }
    set title(value) {
        if (this.title !== value) {
            this.setValue(ProgressBar.titleProperty, value);
            this.updateLayout();
        }
    }
    get value() {
        return this.getValue(ProgressBar.valueProperty);
    }
    set value(value) {
        let adjustedValue = value;
        if (adjustedValue < 0) {
            adjustedValue = 0;
        }
        else if (adjustedValue > 100) {
            adjustedValue = 100;
        }
        if (this.value !== adjustedValue) {
            this.setValue(ProgressBar.valueProperty, adjustedValue);
            this.updateLayout();
        }
    }
    internalRender() {
        let element = document.createElement("div");
        let textBlock = new AC.TextBlock();
        textBlock.setParent(this);
        textBlock.text = this.title;
        textBlock.wrap = true;
        this._titleElement = textBlock.render();
        this._titleElement.style.marginBottom = "6px";
        let progressBarElement = document.createElement("div");
        progressBarElement.style.display = "flex";
        this._leftBarElement = document.createElement("div");
        this._leftBarElement.style.height = "6px";
        this._leftBarElement.style.backgroundColor = AC.stringToCssColor(this.hostConfig.containerStyles.emphasis.foregroundColors.accent.default);
        this._rightBarElement = document.createElement("div");
        this._rightBarElement.style.height = "6px";
        this._rightBarElement.style.backgroundColor = AC.stringToCssColor(this.hostConfig.containerStyles.emphasis.backgroundColor);
        progressBarElement.append(this._leftBarElement, this._rightBarElement);
        element.append(this._titleElement, progressBarElement);
        return element;
    }
    getJsonTypeName() {
        return ProgressBar.JsonTypeName;
    }
    updateLayout(processChildren = true) {
        super.updateLayout(processChildren);
        if (this.renderedElement) {
            if (this.title) {
                this._titleElement.style.display = "none";
            }
            else {
                this._titleElement.style.removeProperty("display");
            }
            this._leftBarElement.style.flex = "1 1 " + this.value + "%";
            this._rightBarElement.style.flex = "1 1 " + (100 - this.value) + "%";
        }
    }
}
ProgressBar.JsonTypeName = "ProgressBar";
//#region Schema
ProgressBar.titleProperty = new AC.StringProperty(AC.Versions.v1_0, "title", true);
ProgressBar.valueProperty = new AC.NumProperty(AC.Versions.v1_0, "value");
__decorate([
    AC.property(ProgressBar.titleProperty)
], ProgressBar.prototype, "title", null);
__decorate([
    AC.property(ProgressBar.valueProperty)
], ProgressBar.prototype, "value", null);
