import { Frame, Loading } from '@shopify/polaris';
import React from 'react';

export function PageLoader() {
    return (
        <div style={{ height: '100px' }}>
            <Frame>
                <Loading />
            </Frame>
        </div>
    );
}