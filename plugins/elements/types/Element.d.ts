import { ComponentClass, FunctionalComponent } from 'preact';
export default interface Element {
    identifier: string;
    component: ComponentClass<any, any> | FunctionalComponent<any>;
}
