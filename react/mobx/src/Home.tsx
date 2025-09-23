import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

class CounterStore {
  counter = { count: 0 };

  constructor() {
    makeObservable(this, {
      counter: observable,
      increment: action,
      decrement: action,
      reset: action,
    });
  }

  increment = () => {
    this.counter.count += 1;
  };

  decrement = () => {
    this.counter.count -= 1;
  };

  reset = () => {
    this.counter.count = 0;
  };
}

const HomeContent = observer(() => {
  const [store] = useState(() => new CounterStore());

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hello, World!</h1>
          <p className="text-gray-600 mb-8">Welcome to the MobX Benchmark</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Counter</h2>
            <div className="text-5xl font-bold text-indigo-600 mb-6">{store.counter.count}</div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={store.decrement}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Decrement
              </button>
              <button 
                onClick={store.reset}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Reset
              </button>
              <button 
                onClick={store.increment}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Increment
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Using MobX state management
          </div>
        </div>
      </div>
    </div>
  );
});

export default function Home() {
  return <HomeContent />;
}