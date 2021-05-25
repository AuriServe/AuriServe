// import * as Preact from 'preact';

// import './CreateElementForm.sass';

// import CardHeader from '../CardHeader';
// import ElementPropsEditor from './ElementPropsEditor';
// import DimensionTransition from '../DimensionTransition';

// import { AppContext } from '../AppContext';

// import * as Element from '../../../../common/interface/Element';

// interface Props {
// 	onCancel: () => void;
// }

// interface State {
// 	stage: number;
// 	identifier: string;

// 	element?: string;
// 	elementProps?: any;
// 	elementPropsDef?: Element.PropsTable;
// }

// export default class CreateElementForm extends Preact.Component<Props, State> {
// 	constructor(props: any) {
// 		super(props);
// 		this.state = { stage: 0, identifier: '' };

// 		this.handleBack = this.handleBack.bind(this);
// 		this.handleForward = this.handleForward.bind(this);

// 		this.handleUpdateValue = this.handleUpdateValue.bind(this);
// 		this.handleElementChange = this.handleElementChange.bind(this);
// 		this.handleIdentifierChange = this.handleIdentifierChange.bind(this);
// 	}

// 	render() {
// 		let editor: Preact.VNode | undefined = undefined;

// 		if (this.state.stage === 1) {
// 			let customElement = this.context.plugins.elements.get(this.state.element);

// 			if (customElement?.element) {
// 				editor = <customElement.editElement props={this.state.elementProps} updateProp={this.handleUpdateValue}/>;
// 			}
// 			else {
// 				editor = <ElementPropsEditor
// 					values={this.state.elementProps}
// 					props={this.state.elementPropsDef!}
// 					setProps={() => { /* Need to set this up or drop this component */ }}
// 				/>;
// 			}
// 		}

// 		return (
// 			<AppContext.Consumer>{ctx =>
// 				<form className="CreateElementForm" onSubmit={(e) => e.preventDefault()}>
// 					<CardHeader icon="/admin/asset/icon/element-dark.svg" title="Create New Element"
// 						subtitle={`Create a new element on ${ctx.data.sitename}.`} />

// 					<DimensionTransition duration={200}>
// 						{this.state.stage === 0 && <div class="CreateElementForm-InnerWrap">
// 							<p className="CreateElementForm-Disclaimer">{
// 								`This form is only for experienced developers, such as the administrator of ${ctx.data.sitename}.
// 								If you ignore this warning you could break your website!`
// 							}</p>

// 							<label>
// 								<span className="CreateElementForm-Label">Identifier</span>
// 								<input type="text" className="CreateElementForm-IdentifierInput"
// 									value={this.state.identifier} onChange={this.handleIdentifierChange}/>
// 							</label>

// 							<label>
// 								<span className="CreateElementForm-Label">Element Type</span>
// 								<select className="CreateElementForm-Select" value={this.state.element} onChange={this.handleElementChange}>
// 									<option value="" key="">- Select Type -</option>
// 									{Object.entries(ctx.data.elementDefs).map(([k, e]) => <option value={k} key={k}>{(e as any).name || k}</option>)}
// 								</select>
// 							</label>
// 						</div>}
// 						{this.state.stage === 1 && <div class="CreateElementForm-InnerWrap">
// 							{editor}
// 							{/* <code>{JSON.stringify(this.state.elementProps, null, 2)}</code> */}
// 						</div>}
// 					</DimensionTransition>

// 					<div className="CreateElementForm-ActionBar">
// 						<div>
// 							<button type="button" onClick={this.handleBack}
// 								className="CreateElementForm-ActionBar-Button">
// 								{this.state.stage === 0 ? 'Cancel' : 'Back'}
// 							</button>
// 						</div>
// 						<div>
// 							<button onClick={this.handleForward}
// 								className="CreateElementForm-ActionBar-Button" >
// 								{this.state.stage === 1 ? 'Create Element' : 'Next'}
// 							</button>
// 						</div>
// 					</div>
// 				</form>
// 			}</AppContext.Consumer>
// 		);
// 	}

// 	private parseProps(_: Element.PropsTable, __: any) {
// 		// Object.entries(props).forEach(([identifier, v]) => {
// 		// 	if ((v as Element.ArrayProp).entries) {
// 		// 		dest[identifier] = [];
// 		// 	}
// 		// 	else if ((v as Element.TableProp).fields) {
// 		// 		dest[identifier] = {};
// 		// 		this.parseProps((v as Element.TableProp).fields, dest[identifier]);
// 		// 	}
// 		// 	else {
// 		// 		const prop = v as Element.FieldProp;
// 		// 		const types = prop.type.replace(/ /g, '').split('|') as Element.PropType[];
// 		// 		const baseTypes = types.map(t => t.split(':')[0] as Element.PropType);

// 		// 		let val: any = undefined;
// 		// 		if (prop.default) val = prop.default;
// 		// 		else switch(baseTypes[0]) {
// 		// 		case 'text': val = ''; break;
// 		// 		case 'long_text': val = ''; break;
// 		// 		case 'number': val = 0; break;
// 		// 		case 'date': val = Date.now(); break;
// 		// 		case 'time': val = 1000 * 60 * 12; break;
// 		// 		case 'datetime': val = Date.now(); break;
// 		// 		case 'boolean': val = false; break;
// 		// 		case 'media': val = ''; break;
// 		// 		case 'url': val = ''; break;
// 		// 		case 'color': val = '#000'; break;
// 		// 		default: console.log(baseTypes[0], 'does not have hardcoded default!');
// 		// 		}

// 		// 		dest[identifier] = val;
// 		// 	}
// 		// });
// 	}

// 	private handleUpdateValue(identifier: string, value: any) {
// 		let splitPath = identifier.split('.');

// 		let src = Object.assign({}, this.state.elementProps);
// 		let down = src;
// 		for (let i = 0; i < splitPath.length; i++) {
// 			if (i < splitPath.length - 1) {
// 				src[splitPath[i]] = Object.assign({}, src[splitPath[i]]);
// 				down = down[splitPath[i]];
// 			}
// 			else {
// 				down[splitPath[i]] = value;
// 			}
// 		}

// 		this.setState({ elementProps: src });
// 	}

// 	private handleIdentifierChange(e: any) {
// 		this.setState({identifier: e.target.value});
// 	}

// 	private handleElementChange(e: any) {
// 		const identifier = e.target.value;

// 		if (!identifier) {
// 			this.setState({ element: undefined, elementProps: undefined });
// 		}
// 		else {
// 			const elem = this.context.data.elementDefs[identifier];

// 			let props = {};
// 			this.parseProps(elem.props, props);
// 			this.setState({ element: identifier, elementProps: props, elementPropsDef: elem.props });
// 		}
// 	}

// 	private handleBack() {
// 		let stage = this.state.stage;
// 		if (stage === 0) this.props.onCancel();
// 		else this.setState({ stage: stage - 1});
// 	}

// 	private handleForward() {
// 		let stage = this.state.stage;

// 		if (stage === 0 && !this.state.element) return;
// 		if (stage === 1) {
// 			this.handleSubmitForm(); return;
// 		}

// 		this.setState({ stage: stage + 1});
// 	}

// 	private handleSubmitForm() {
// 		let ctx = this.context;
// 		fetch('/admin/elements/create', {
// 			method: 'POST',
// 			cache: 'no-cache',
// 			headers: {'Content-Type': 'application/json'},
// 			body: JSON.stringify({
// 				identifier: this.state.identifier,
// 				element: this.state.element,
// 				props: this.state.elementProps
// 			})
// 		}).then(r => r.json()).then(res => {
// 			console.log(res);
// 			ctx.handleSiteData(res);
// 		});
// 	}
// }

// CreateElementForm.contextType = AppContext;
