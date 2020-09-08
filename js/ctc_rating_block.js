const registerBlockType = wp.blocks.registerBlockType;
const __ = wp.i18n.__;
const crtEl = wp.element.createElement;
registerBlockType('ctc-rating/add-ctc-rating', {

    title: __('CTC Rating', 'ctc-rating'),
    description: __('Block to add ctc rating to page or post', 'ctc-rating'),
    icon: 'thumbs-up',
    category: 'common',
    keywords: [__('rating'), __('thumbs up'), __('thumbs down')],

    example: {
        attributes: {
            'preview': true,
        },
    },

    edit: props => crtEl('div', { className: 'ctc-rating-block ' }, '',
        crtEl('span', { style: { textShadow: '5px 5px 10px  rgba(0,0,0,0.8)', lineHeight: '1.5', fontSize: "25px" }, className: 'dashicons dashicons-thumbs-up' }),
        crtEl('span', { style: { padding: '2px', width: '70', height: '25', border: '1px solid rgba(0,0,0,1)', marginLeft: '5px', marginRight: '5px;', fontSize: '15px' }, }, '10,000'),
        crtEl('span', { style: { padding: '2px', width: '70', height: '25', border: '1px solid rgba(0,0,0,1)', marginLeft: '5px', marginRight: '5px;', fontSize: '15px' }, }, '10,000'),
        crtEl('span', { style: { textShadow: '5px 5px 10px  rgba(0,0,0,0.8)', lineHeight: '1.7', fontSize: "25px" }, className: 'dashicons dashicons-thumbs-down' })),

    save: () => crtEl('div', { className: 'ctc-rating-block' }, '[ctc_rating]')

})