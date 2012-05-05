define(function () {
    var UNSAFE_URI_PATTERN = new RegExp('^(?:javascript):.+');
    var URL_PATTERN = new RegExp('^url\\(');

    function isSafeURI(attribute, uri) {
        return ('' + uri).match(UNSAFE_URI_PATTERN) === null;
    }

    return {
        '!api': {
            '*': true
        },
        '!elements': {
            '!attributes': {
                '*': {
                    abbr: true,
                    'accept-charset': true,
                    accept: true,
                    accesskey: true,
                    action: false,
                    align: true,
                    alink: false, // XXX: is this dangerous?
                    alt: true,
                    archive: false, // XXX: list of URIs
                    axis: true,
                    background: isSafeURI,
                    bgcolor: true,
                    border: true,
                    cellpadding: true,
                    cellspacing: true,
                    'char': true,
                    charoff: true,
                    charset: true,
                    checked: true,
                    cite: isSafeURI,
                    'class': true,
                    className: true,
                    classid: false, // XXX: applies to object; should whitelist the ids
                    clear: true,
                    code: false, // XXX: URI; applies to applet
                    codebase: false, // XXX: URI; applies to applet
                    codetype: false, // XXX: content-type; probably safe
                    color: true,
                    cols: true,
                    colspan: true,
                    compact: true,
                    content: false, // XXX: CDATA; applies to meta
                    coords: true,
                    // XXX: should we allow data-*?
                    data: false, // XXX: URI; applies to object
                    datetime: true,
                    declare: false, // XXX: applies to object
                    defer: false, // XXX: applies to script
                    dir: true,
                    disabled: true,
                    enctype: true, // XXX: make sure that setting the encoding doesn't screw us
                    face: true,
                    'for': true,
                    frame: true,
                    frameborder: true,
                    headers: true,
                    height: true, // XXX: may need to interpose on this, but probably not
                    href: isSafeURI,
                    hreflang: true,
                    hspace: true,
                    'http-equiv': false, // XXX: applies to meta
                    id: true, // XXX: need to interpose and prevent setting duplicate
                              // of id outside their sandbox
                    ismap: false, // XXX: browsers does server request based on click
                    label: true,
                    lang: true,
                    language: false, // XXX: applies to script
                    link: false, // XXX: applies to body
                    longdesc: isSafeURI,
                    marginheight: true,
                    maxlength: true,
                    media: false, // XXX: dunno what this does
                    method: true,
                    multiple: true,
                    name: true, // XXX: need to interpose and not allow setting it
                                // to value set outside the sandbox
                    nohref: true,
                    noresize: true,
                    noshade: true,
                    nowrap: true,
                    object: false, // XXX: applies to object
                    onblur: false,
                    onchange: false,
                    onclick: false,
                    ondblclick: false,
                    onfocus: false,
                    onkeydown: false,
                    onkeypress: false,
                    onkeyup: false,
                    onload: false,
                    onmousedown: false,
                    onmousemove: false,
                    onmouseout: false,
                    onmouseover: false,
                    onmouseup: false,
                    onreset: false,
                    onselect: false,
                    onsubmit: false,
                    onunload: false,
                    profile: isSafeURI,
                    prompt: true,
                    readonly: true,
                    rel: true,
                    rev: true,
                    rows: true,
                    rowspan: true,
                    rules: true,
                    scheme: false, // XXX: applies to meta
                    scope: true, // XXX: check this
                    scrolling: true,
                    selected: true,
                    shape: true,
                    size: true,
                    span: true,
                    src: isSafeURI,
                    standby: false, // XXX: applies to object
                    start: true,
                    style: {
                        // The monitor will never allow style to be set directly.
                        // Only properly prefixed style attributes set by the broker
                        // are allowed.

                        azimuth: true,
                        backgroundAttachment: true,
                        backgroundColor: true,
                        backgroundImage: false, // XXX: URI
                        backgroundPosition: true,
                        backgroundRepeat: true,
                        background: false, // XXX: URI
                        borderCollapse: true,
                        borderColor: true,
                        borderSpacing: true,
                        borderStyle: true,
                        borderTop: true,
                        borderRight: true,
                        borderBottom: true,
                        borderLeft: true,
                        borderTopColor: true,
                        borderRightColor: true,
                        borderBottomColor: true,
                        borderLeftColor: true,
                        borderTopStyle: true,
                        borderRightStyle: true,
                        borderBottomStyle: true,
                        borderLeftStyle: true,
                        borderTopWidth: true,
                        borderRightWidth: true,
                        borderBottomWidth: true,
                        borderLeftWidth: true,
                        borderWidth: true,
                        border: true,
                        bottom: true,
                        captionSide: true,
                        clear: true,
                        clip: true,
                        color: true,
                        content: false, // XXX: dynamic content
                        counterIncrement: false, // XXX: wtf is this?
                        counterReset: false, // XXX: wtf is this?
                        cueAfter: false, // XXX: URI
                        cueBefore: false, // XXX: URI
                        cue: false, // XXX: URI
                        cursor: false, // XXX: URI
                        direction: true,
                        display: true,
                        elevation: true,
                        emptyCells: true,
                        'float': true,
                        fontFamily: true,
                        fontSize: true,
                        fontStyle: true,
                        fontVariant: true,
                        fontWeight: true,
                        font: true,
                        height: true,
                        left: true,
                        letterSpacing: true,
                        lineHeight: true,
                        listStyleImage: false, // XXX: URI
                        listStylePostion: true,
                        listStyleType: true,
                        listStyle: false, // XXX: URI
                        margin: true,
                        marginTop: true,
                        marginRight: true,
                        marginBottom: true,
                        marginLeft: true,
                        maxHeight: true,
                        maxWidth: true,
                        minHeight: true,
                        minWidth: true,
                        orphans: true,
                        outlineColor: true,
                        outlineStyle: true,
                        outlineWidth: true,
                        outline: true,
                        overflow: true,
                        padding: true,
                        paddingTop: true,
                        paddingRight: true,
                        paddingBottom: true,
                        paddingLeft: true,
                        pageBreakAfter: true,
                        pageBreakBefore: true,
                        pageBreakInside: true,
                        pauseAfter: true,
                        pauseBefore: true,
                        pause: true,
                        pitchRange: true,
                        pitch: true,
                        playDuring: false, // XXX: URI
                        position: true,
                        quotes: false, // XXX: dynamic content
                        richness: true,
                        right: true,
                        speakHeader: true,
                        speakNumeral: true,
                        speakPunctuation: true,
                        speak: true,
                        speechRate: true,
                        stress: true,
                        tableLayout: true,
                        textAlign: true,
                        textDecoration: true,
                        textIndent: true,
                        textTransform: true,
                        top: true,
                        unicodeBidi: true,
                        verticalAlign: true,
                        visibility: true,
                        voiceFamily: true,
                        volume: true,
                        whiteSpace: true,
                        widows: true,
                        width: true,
                        wordSpacing: true,
                        zIndex: true
                    },
                    summary: true,
                    tabindex: true, // XXX: think about this. could be an attack vector
                    target: true, // XXX: check this
                    text: true,
                    title: true,
                    type: true,
                    usemap: isSafeURI,
                    valign: true,
                    value: true,
                    valuetype: true, // XXX: check this
                    version: true,
                    vlink: false, // XXX: applies to body
                    vspace: true,
                    width: true // XXX: may need to interpose on this
                }
            },
            '!tags': {
                '*': false,
                a: true,
                abbr: true,
                acronym: true,
                address: true,
                applet: false, // XXX: can we?
                area: false, // XXX: can we?
                b: true,
                base: false, // XXX: wtf is this?
                basefont: false, // XXX: wtf is this?
                bdo: true,
                big: true,
                blockquote: true,
                body: false,
                br: true,
                button: true,
                caption: true,
                center: true,
                cite: true,
                code: true,
                col: true,
                colgroup: true,
                dd: true,
                del: true,
                dfn: true,
                dir: true,
                div: true,
                dl: true,
                dt: true,
                em: true,
                embed: false, // XXX: can this be sanitized?
                fieldset: true,
                font: true,
                form: true,
                frame: false, // XXX: can we?
                frameset: false, // XXX: can we?
                h1: true,
                h2: true,
                h3: true,
                h4: true,
                h5: true,
                h6: true,
                head: false,
                hr: true,
                html: false,
                i: true,
                iframe: false, // XXX: can we?
                img: true,
                input: true,
                ins: true,
                isindex: true, // XXX: wtf is this?
                kbd: true,
                label: true,
                legend: true,
                li: true,
                link: false, // XXX: can we?
                map: false, // XXX: can we?
                menu: true,
                meta: false,
                noframes: true,
                noscript: true,
                object: false, // XXX: can this be sanitized?
                ol: true,
                optgroup: true,
                option: true,
                p: true,
                param: true, // XXX: wtf is this?
                pre: true,
                q: true,
                s: true,
                samp: true,
                script: false,
                select: true,
                small: true,
                span: true,
                strike: true,
                strong: true,
                style: false,
                sub: true,
                sup: true,
                table: true,
                tbody: true,
                td: true,
                textarea: true,
                tfoot: true,
                th: true,
                thead: true,
                title: false,
                tr: true,
                tt: true,
                u: true,
                ul: true,
                val: true,
                'var': true
            }
        }
    };
});
