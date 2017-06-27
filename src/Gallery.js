import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import ScrollLock from 'react-scrolllock';

import theme from './theme';
import Container from './components/Container';
import Header from './components/Header';
import Portal from './components/Portal';

import { bindFunctions } from './utils';

const classes = StyleSheet.create({
    content: {
		position: 'relative',
	},
	figure: {
		margin: 0, // remove browser default
	},
	image: {
		display: 'block', // removes browser default gutter
		height: 'auto',
		margin: '0 auto', // maintain center on very short screens OR very narrow image
		maxWidth: '100%',

		// disable user select
		WebkitTouchCallout: 'none',
		userSelect: 'none',
	},
});

class Gallery extends Component {
    constructor(props) {
        super(props);

        bindFunctions.call(this, [
            'handleKeyboardInput'
        ]);
    }
    getChildContext() {
        return {
            theme: this.props.theme
        }
    }
    componentDidMount () {
		if (this.props.isOpen && this.props.enableKeyboardInput) {
			window.addEventListener('keydown', this.handleKeyboardInput);
		}
	}
    componentWillReceiveProps (nextProps) {
        // add/remove event listeners
		if (!this.props.isOpen && nextProps.isOpen && nextProps.enableKeyboardInput) {
			window.addEventListener('keydown', this.handleKeyboardInput);
		}
		if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
			window.removeEventListener('keydown', this.handleKeyboardInput);
		}
    }
    componentWillUnmount() {
        if (this.props.enableKeyboardInput) {
			window.removeEventListener('keydown', this.handleKeyboardInput);
		}
    }
    handleKeyboardInput (event) {
		if (event.keyCode === 37) { // left
			this.gotoPrev(event);
			return true;
		} else if (event.keyCode === 39) { // right
			this.gotoNext(event);
			return true;
		} else if (event.keyCode === 27) { // esc
			this.props.onClose();
			return true;
		}
		return false;

	}
    renderDialog() {
        const {
            isOpen,
            onClose,
            showCloseButton
        } = this.props;

        if( !isOpen ) return <span key="closed" />

        return (
            <Container>
                <div className={css(classes.content)}>
                    <Header
                        onClose={onClose}
                        showCloseButton={showCloseButton}
                    />
                    {this.renderImages()}
                    KKK
                </div>
            </Container>
        )
    }
    renderImages() {
        return (
            <figure className={css(classes.figure)}>
                <img
                    className={css(classes.image)}
                    src={'http://via.placeholder.com/350x150'}
                />
            </figure>
        )
    }
    render() {
        return (
            <Portal>
                {this.renderDialog()}
            </Portal>
        )
    }
}

Gallery.propTypes = {
    onClose: PropTypes.func.isRequired
}

Gallery.defaultProps = {
    showCloseButton: true
}

Gallery.childContextTypes = {
    theme: PropTypes.object.isRequired
}

module.exports = Gallery;
