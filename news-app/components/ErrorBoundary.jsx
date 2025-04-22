'use client';

import { Component } from 'react';
import { Alert, Button } from '@mui/material';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert 
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              REFRESH
            </Button>
          }
        >
          Something went wrong. Please try refreshing the page.
        </Alert>
      );
    }

    return this.props.children;
  }
}