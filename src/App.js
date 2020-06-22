import React, { useEffect, useState} from 'react';
import Slider from 'rc-slider';
import API, { graphqlOperation } from '@aws-amplify/api'

import * as subscriptions from './graphql/subscriptions'
import * as mutations from './graphql/mutations'

import './App.css';
import 'rc-slider/assets/index.css';

import awsconfig from './aws-exports';

API.configure(awsconfig)


const Counter = (props) => {

  const [value, setValue] = useState(0)

  useEffect(() => {
    let subscription

    async function setupSubscription() {
      subscription = API.graphql({
          query: subscriptions.counterChange,
          variables: { name: props.name },
          authMode: 'API_KEY',
        }).subscribe({
        next: (data) => {
          console.log('Got subscription data', data)
          const counterChange = data.value.data.counterChange
          setValue(counterChange.value)
        }
      })
    }

    setupSubscription()

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.name])  

  const sendUpdate = async (value) => {
    setValue(value)
    await API.graphql(graphqlOperation(mutations.setCounter, { name: props.name, value}))
  }

  return (
    <Slider value={value} onChange={v => setValue(v)} onAfterChange={sendUpdate} />
  )
}



function App() {

  return (
    <div className="App">
      <h1>Foobar Realtime Slider Demo</h1>

      <p>Open me on multiple browsers, then change a slider in one browser and watch the same one update on all the other browsers.</p>

      <div>
        Slider 1:  <Counter name="Slider1" />
      </div>

      <div>
        Slider 2: <Counter name="Slider2" />
      </div>
    </div>
  );
}

export default App;
