/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit() {
	return (
		<div { ...useBlockProps() }>
			 
			 <div className='ctc-rating-block' style={{height:"35px"}}>
				<span style={{  marginTop : '-3px',textShadow: '5px 5px 10px  rgba(0,0,0,0.8)', lineHeight: '1.5', fontSize: "25px" }} className='dashicons dashicons-thumbs-up'> </span>
				<span style={ { padding: '2px', width: '70', height: '25', border: '1px solid rgba(0,0,0,1)', marginLeft: '5px', marginRight: '5px;', fontSize: '15px' }}>1000</span>
				<span style={{ padding: '2px', width: '70', height: '25', border: '1px solid rgba(0,0,0,1)', marginLeft: '5px', marginRight: '5px;', fontSize: '15px' }}>1000</span>
				<span style={{ marginTop : '-5px', textShadow: '5px 5px 10px  rgba(0,0,0,0.8)', lineHeight: '1.7', fontSize: "25px" }}  className='dashicons dashicons-thumbs-down' > </span>
			 </div>
		</div>
	);
}
