// polyfills etc
// mutationobserver
/* eslint-disable import/no-extraneous-dependencies */
import 'mutationobserver-shim';
import '@axa-ch/patterns-library-polyfill';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
