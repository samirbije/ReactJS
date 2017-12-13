/**
 * Created by syed on 3/17/2017.
 */
import React, { Component } from "react"
import { TranslatorProvider } from "react-translate"


var TranslationWrapper = ComposedComponent => class extends Component {

    constructor(props) {
        super(props);

        this.state = {
            translationsOverride: null
        };
    }

    render() {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props

        const { translations } = this.props;
        const { translationsOverride } = this.state

        const { otherprops } = this.props;

        return (
            <TranslatorProvider  translations={translationsOverride || translations}>
                <ComposedComponent {...this.props} />
            </TranslatorProvider>

        )
    }
};

export default TranslationWrapper
//export default translate("TranslationWrapper")(TranslationWrapper)
