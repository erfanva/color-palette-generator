const ANALYTICS_KEY = "color_is_everything"

function send(key) {
    let logo_i_param = "host: " + window.location.host;

    if (document.referrer) logo_i_param += "\nref: " + document.referrer;

    const logo_url = "https://static.erfanva.com/assets/logo.png";
    let src = logo_url;
    src += "?i=" + encodeURIComponent(logo_i_param);
    if (key) src += "&k=" + key;

    const img_node = document.createElement("img");
    img_node.src = src;
    img_node.style.display = "none";
    document.body.appendChild(img_node);
}

send(ANALYTICS_KEY);