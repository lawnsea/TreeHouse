// source: http://www.w3.org/TR/html4/index/attributes.html
define({
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
    background: false, // XXX: URI
    bgcolor: true,
    border: true,
    cellpadding: true,
    cellspacing: true,
    'char': true,
    charoff: true,
    charset: true,
    checked: true,
    cite: false, // XXX: URI
    'class': true,
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
    /* XXX: should we allow data-*? */
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
    href: false, // XXX: URI
    hreflang: true,
    hspace: true,
    'http-equiv': false, // XXX: applies to meta
    id: true, // XXX: need to interpose and prevent setting duplicate of id outside their sandbox
    ismap: false, // XXX: browsers does server request based on click
    label: true,
    lang: true,
    language: false, // XXX: applies to script
    link: false, // XXX: applies to body
    longdesc: false, // XXX: URI
    marginheight: true,
    maxlength: true,
    media: false, // XXX: dunno what this does
    method: true,
    multiple: true,
    name: true, // XXX: need to interpose and not allow setting it to value set outside the sandbox
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
    profile: false, // XXX: URI
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
    src: false, // XXX: URI
    standby: false, // XXX: applies to object
    start: true,
    style: false, // XXX: cannot allow this. only allow style updates from loader
    summary: true,
    tabindex: true, // XXX: think about this. could be an attack vector
    target: true, // XXX: check this
    text: true,
    title: true,
    type: true,
    usemap: false, // XXX: URI
    valign: true,
    value: true,
    valuetype: true, // XXX: check this
    version: true,
    vlink: false, // XXX: applies to body
    vspace: true,
    width: true // XXX: may need to interpose on this
});
