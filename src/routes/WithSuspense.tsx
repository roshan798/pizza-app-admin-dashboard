import { Suspense, type JSX } from 'react';

export default function WithSuspense(el: JSX.Element) {
	return <Suspense fallback={<div>Loading...</div>}>{el}</Suspense>;
}
