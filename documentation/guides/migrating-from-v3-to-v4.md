# Migrating from v3 to v4

Polaris v4 contains mostly internal changes and has many migration paths. This guide goes through the necessary steps to deal with breaking changes in your application.

**Note:** This migration guide is for v3 but may apply for v2 as well.

- [Testing](#polaris-testing)
- [Component API Changes](#polaris-component-api-changes)
  - [AppProvider](#polaris-appprovider)
    - [i18n](#polaris-i18n)
  - [Navigation](#polaris-navigation)
    - [iconBody](#polaris-icon-body)
  - [ChoiceList](#polaris-choicelist)
    - [title](#polaris-title)
  - [Card](#polaris-card)
    - [secondaryFooterAction](#polaris-secondaryfooteraction)
  - [Select](#polaris-select)
    - [groups](#polaris-groups)
  - [Icon](#polaris-icon)
    - [source](#polaris-source)
    - [untrusted](#polaris-untrusted)
- [Removed Exports/Components](#polaris-removed-exportscomponents)
  - [WithContext](#polaris-withcontext)
  - [WithRef](#polaris-withref)
  - [Autocomplete.ComboBox.TextField](#polaris-autocompletecomboboxtextfield)
  - [Autocomplete.ComboBox.OptionList](#polaris-autocompletecomboboxoptionlist)
  - [Navigation.UserMenu](#polaris-navigationusermenu)
  - [Modal.Dialog/Tabs.Panel](#polaris-dialog-panel)
- [Dependencies](#polaris-dependencies)
- [Typescript](#polaris-typescript)
  - [Config](#polaris-config)
  - [Types](#polaris-types)

## Testing <a name="polaris-testing"></a>

We’ve migrated to [React’s new context API](https://reactjs.org/docs/context.html) while restructuring Polaris React’s entire context structure. Using the Polaris test provider will allow you to keep up to date on Polaris React's internal contexts.

In v3, you could hook into Polaris's context types.

**Note:** These examples use [Enzyme](https://airbnb.io/enzyme/). Other testing libraries can also be used, as shown in [these examples](https://github.com/Shopify/polaris-react/tree/master/examples).

```jsx
// old
import merge from 'lodash/merge';
import {shallow, mount} from 'enzyme';
import {createPolarisContext, polarisContextTypes} from '@shopify/polaris';

function mergeAppProviderOptions(options) {
  const context = createPolarisContext();

  return merge(
    {},
    {
      context,
      childContextTypes: polarisContextTypes,
    },
    options,
  );
}

export function mountWithAppProvider(node, options) {
  return mount(node, mergeAppProviderOptions(options));
}

export function shallowWithAppProvider(node, options) {
  return shallow(node, mergeAppProviderOptions(options)).dive(options);
}
```

Moving forward you'll want to wrap your code in the Polaris test provider.

```jsx
// new
import {mount} from 'enzyme';
import {PolarisTestProvider} from '@shopify/polaris';

export function mountWithPolaris(node) {
  return mount<P>(
    <PolarisTestProvider {...context}>{node}</PolarisTestProvider>,
  );
}
```

## Component API changes <a name="polaris-component-api-changes"></a>

### AppProvider <a name="polaris-appprovider"></a>

#### i18n <a name="polaris-i18n"></a>

i18n is now a required prop and Polaris includes [many translations](https://github.com/Shopify/polaris-react/blob/master/locales) to support internationalization.

```jsx
import fr from '@shopify/polaris/locales/fr.json';
...
<AppProvider i18n={fr}>
...
```

### Navigation <a name="polaris-navigation"></a>

#### iconBody <a name="polaris-icon-body"></a>

<!-- ping ben or andre about this <svg><path d='M17 9h-6V3a1 1 0 1 0-2 0v6H3a1 1 0 1 0 0 2h6v6a1 1 0 1 0 2 0v-6h6a1 1 0 1 0 0-2'  fill-rule='evenodd'/></svg> doesnt seem to work -->

Pass a string to the icon prop instead.

### ChoiceList <a name="polaris-choicelist"></a>

#### title <a name="polaris-title"></a>

Title is now a required prop for accessibility concerns, however, it can be hidden with the titleHidden prop to keep your UI the same.

```jsx
const choiceListMarkup = (
  <ChoiceList
    title={'Company name'}
    choices={[
      {label: 'Hidden', value: 'hidden'},
      {label: 'Optional', value: 'optional'},
      {label: 'Required', value: 'required'},
    ]}
    selected={['hidden']}
  />
);
```

### Card <a name="polaris-card"></a>

#### secondaryFooterAction <a name="polaris-secondaryfooteraction"></a>

`secondaryFooterAction` has been removed in favor of `secondaryFooterActions` which behaves the same expect it'll accept an array of actions.

```jsx
// old
<Card secondaryFooterAction={{content: 'Dismiss'}}>Polaris</Card>

// new
<Card secondaryFooterActions={[{content: 'Dismiss'}]}>Polaris</Card>
```

### Select <a name="polaris-select"></a>

#### groups <a name="polaris-groups"></a>

`groups` has been removed in favor of `options` which accepts `groups` or `options`.

```jsx
const options = [
  {label: 'Today', value: 'today'},
  {label: 'Yesterday', value: 'yesterday'},
  {label: 'Last 7 days', value: 'lastWeek'},
];

const groups = [{title: 'Group', options}];

// old
<Select
  groups={groups}
  ...
/>

// new
<Select
  options={groups}
  ...
/>
```

### Icon <a name="polaris-icon"></a>

#### source <a name="polaris-source"></a>

Support for passing a string into `source` to load bundled icons has been removed. Now you can load icons from `@shopify/polaris-icons`.

```jsx
// old
<Icon source="BUNDLED_ICON_NAME" />

// new
import {AccessibilityMajorMonotone} from '@shopify/polaris-icons';
...
<Icon source={AccessibilityMajorMonotone} />
...
```

Using a `SvgSource` shaped object has been removed as well to load an icon imported using Shopify's legacy icon loader. You must update sewing-kit to at least v0.82.0 which replaced the legacy loader with using SVGR. Loading a react element as the icon's source has been replaced with accepting a react components that returns an SVG element.

<!-- ping ben / andre -->

```jsx
...
function Hamburger () {
  return (
    ...
  )
}

...
<Icon source={Hamburger} />
...

```

#### untrusted <a name="polaris-untrusted"></a>

All icons rendered with a string as the source will be considered untrusted.

## Removed Exports/Components <a name="polaris-removed-exportscomponents"></a>

### WithContext <a name="polaris-withcontext"></a>

`WithContext` as an internal abstraction used for class components. Use hooks or contextType instead.

```jsx
// old
function Test({context}) {
  console.log(context);
  return null;
}

const TestWithContext = withContext(Consumer)(Test);

// new with hooks
function Test() {
  const testContext = useContext(TestContext);
  return <h1>{testContext}</h1>;
}

// new with contextType
const TestContext = createContext('Polaris');

class Test extends Component {
  static contextType = TestContext;

  render() {
    const testContext = this.context;
    return <h1>{testContext}</h1>;
  }
}
```

### WithRef <a name="polaris-withref"></a>

`WithRef` was an internal component used to place refs on components wrapped in higher-order components. Use functional components instead.

```jsx
// old
class Input extends React.PureComponent {
  inputRef = createRef();

  focus = () => {
    inputRef.current.focus();
  };

  render() {
    return <input ref={inputRef} {...props} />;
  }
}

const WrappedInput = compose(
  hocOne,
  hocTwo,
  hocX,
  withRef,
)(Input);

class App extends React.PureComponent {
  input = createRef();

  componentDidMount() {
    input.current.focus();
  }

  render() {
    return (
      <ReffableInput
        ref={reffableInput}
        onFocus={() => console.log('focused')}
      />
    );
  }
}

// new with hooks
function Input(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));
  return <input ref={inputRef} {...props} />;
}
const ReffableInput = forwardRef(Input);

function App() {
  const reffableInput = useRef();

  useEffect(() => {
    reffableInput.current.focus();
  }, []);

  return (
    <ReffableInput ref={reffableInput} onFocus={() => console.log('focused')} />
  );
}
```

### Autocomplete.ComboBox.TextField <a name="polaris-autocompletecomboboxtextfield"></a>

Use `Autocomplete.TextField` instead.

```jsx
...
const textFieldMarkup = (
  <Autocomplete.TextField
    label="Example"
  />
);
...
```

### Autocomplete.ComboBox.OptionList <a name="polaris-autocompletecomboboxoptionlist"></a>

Use `OptionList` instead.

```jsx
...
const optionListMarkup = (
  <OptionList
    onChange={() => {}}
    selected={[]}
  />
);
...
```

### Navigation.UserMenu <a name="polaris-navigationusermenu"></a>

Use `TopBar.UserMenu` instead

```jsx
const userMenuMarkup = (
  <TopBar.UserMenu
    actions={[]}
    name="Andrew"
    initials="AM"
    open
    onToggle={() => {}}
  />
);
```

### Modal.Dialog/Tabs.Panel <a name="polaris-dialog-panel"></a>

`Dialog` and `Panel` are subcomponents that are used by Polaris to build the respective component and are not intended to be used outside of their component.

## Dependencies <a name="polaris-dependencies"></a>

React/ReactDOM are peer dependencies of Polaris and have been bumped to 16.8.6 to enable the use of hooks. Use `yarn` or `npm` to install a recent version of React.

```bash
# yarn
yarn add react react-dom

# npm
npm i react react-dom
```

## TypeScript <a name="polaris-typescript"></a>

### Config <a name="polaris-config"></a>

The method for importing React changed to use default imports.

```jsx
// old
import * as React from 'react';

// new
import React from 'react';
```

Because of this consuming TypeScript applications must enable [esModuleInterop](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#support-for-import-d-from-cjs-from-commonjs-modules-with---esmoduleinterop) or use the esModuleInterop command line option

```js
// tsconfig.json
{
  ...
  "compilerOptions": {
    ...
    "esModuleInterop": true,
    ...
  }
}
```

```bash
# CLI
tsc --esModuleInterop ...
```

### Types <a name="polaris-types"></a>

`LinkLikeComponent` type was removed. Use `AppProviderProps['linkComponent']` instead.

```jsx
// old
import {LinkLikeComponent} from '@shopify/polaris-react';

type Link = LinkLikeComponent;

// new
import {AppProviderProps} from '@shopify/polaris-react';

type Link = AppProviderProps['linkComponent'];
```
