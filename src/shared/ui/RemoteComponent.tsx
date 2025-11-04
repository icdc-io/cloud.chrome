import React, { Component, type ReactNode } from "react";
import { loadComponent } from "@/shared/lib/index";

interface IExampleComponentProps {
	children: ReactNode;
}

interface IExampleComponentState {
	hasError: boolean;
}

class ErrorBoundary extends Component<
	IExampleComponentProps,
	IExampleComponentState
> {
	state = {
		hasError: false,
	};

	static getDerivedStateFromError() {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidUpdate(
		_prevProps: IExampleComponentProps,
		prevState: IExampleComponentState,
	) {
		if (this.state.hasError && prevState.hasError) {
			this.setState({ hasError: false });
		}
	}

	render() {
		if (this.state.hasError) {
			return <h1>Sorry.. there was an error</h1>;
		}

		return this.props.children;
	}
}

type RemoteComponentType = {
	remote: string;
	remoteUrl: string;
	service?: string;
	scope?: string;
	remoteFilename?: string;
	version?: string;
	fallback: ReactNode;
	store: unknown;
};

const RemoteComponent = ({
	remote,
	remoteUrl,
	service = "",
	scope = "default",
	remoteFilename = "remoteEntry",
	version,
	fallback = null,
	...props
}: RemoteComponentType) => {
	const Component = React.lazy(
		loadComponent(service, remoteUrl, remote, version, remoteFilename, scope),
	);

	return (
		<ErrorBoundary>
			<React.Suspense fallback={fallback}>
				<Component {...props} />
			</React.Suspense>
		</ErrorBoundary>
	);
};

export default RemoteComponent;
