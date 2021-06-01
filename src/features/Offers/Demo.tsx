import * as React from 'react';
import { Button } from '@components/Button';
import { OnTokenOptions } from '../../interfaces';
import { fetchJson, useFetchOnInit } from '@core/Api';

/** JUST DEMO !! Showcase of API module */

// mock token for demo
const token: OnTokenOptions = {
  getValidToken: () => 'mock',
  token_type: 'Bearer',
  referrer: location.href,
};

type DemoResponseType = {
  firstName: string;
  lastName: string;
};

// ### API call using performed 'on init' using hook - useFetchOnInit ###
// @ts-ignore
const DemoApiWithHook: React.FC = () => {

  // call api on component init - hook returns loading/error/response data
  // some other possible options are commented
  // we expect that response is type of DemoResponseType
  const { response, loading, error } = useFetchOnInit<DemoResponseType>(
    {
      apiBaseUrl: '',
      endpoint: '/demo-endpoint',
      language: 'de',
      token: { getValidToken: () => 'abc', token_type: 'Bearer', referrer: location.href },
      // apiBaseUrl: 'https://not-default-url.ch/'
      // urlParams: { key: 'value' },
      // method: 'PATCH',
      // payload: { name: 'Joe Doe' },
    },
  );

  return (
    <div>
      {loading && (<p>loading...</p>)}
      {error && (<p>api call failed: {error}</p>)}
      {response && (<p>data: {response?.firstName} {response?.lastName}</p>)}
    </div>
  );
};

// ### API call performed on event execution (state is handled manually) - fetchJson() ###
// in this demo we call '/api-demo-endpoint' (does not exist) and we expect that response is type of DemoResponseType

/** type of local state */
type StateType = {
  postRequest: {
    isLoading: boolean,
    error?: string,
    data?: DemoResponseType,
  },
};

// @ts-ignore
const DemoApiOnEvent: React.FC = () => {

  /** initial object for local state */
  const initialState: StateType = {
    postRequest: {
      isLoading: false,
    },
  };

  // @ts-ignore
  const [state, setState] = React.useState<StateType>(initialState);

  // call api on button click - manually handle loading/error/data
  const onButtonClickHandler = async () => {
    setState({ ...state, postRequest: { isLoading: true } });
    try {
      const postRes = await fetchJson<DemoResponseType>({
        apiBaseUrl: '',
        endpoint: '/demo-endpoint',
        language: 'de',
        token,
        method: 'POST',
        payload: 'Init value for payload', // or use some data from event e.g e.target.value, depends on use-case
      });
      setState({ ...state, postRequest: { isLoading: false, data: postRes } });
    } catch (e) {
      setState({ ...state, postRequest: { isLoading: false, error: e } });
    }
  };

  return (
    <div>
      <Button onClick={onButtonClickHandler}>
        Call API
      </Button>

      {state.postRequest.isLoading && (<p>POST is loading...</p>)}
      {state.postRequest.error && (<p>POST api call failed: {state.postRequest.error}</p>)}
      {state.postRequest.data && (<p>data from POST api call: {state.postRequest.data?.firstName} {state.postRequest.data?.lastName}</p>)}
    </div>
  );
};
