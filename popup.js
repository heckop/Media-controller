/* global browser */

const tablist = document.getElementById("tabs");

async function sendMessageToTabs(tabs) {
  let first = true;
  // 1. determine which tabs have media elements available and playing

  for (const tab of tabs) {
    try {
      const res = await browser.tabs.sendMessage(tab.id, { cmd: "query" });
      //console.debug(JSON.stringify(res, null, 4));
      if (res.length > 0) {
        if (first) {
          tablist.textContent = "";
          first = false;
        }
          


        const url = new URL(tab.url);
        let favicon = tab.favIconUrl;
        let title = tab.title;
        let faviconimg = document.createElement("img");
        faviconimg.src = favicon;
        faviconimg.style = "width:20px;height:20px;float:left;";
        let tabdiv = document.createElement("div");
        tabdiv.style = "padding-bottom:5px;margin-bottom:5px;width: 500px;";
        tablist.appendChild(tabdiv);
        let imgdiv = document.createElement("div");
        imgdiv.appendChild(faviconimg);
        let tablink = document.createElement("button");
        tablink.textContent = url.hostname;
        tablink.style = "top:10%;margin-top:0px;word-break: break-all;text-align:left;border:none;";
        imgdiv.appendChild(tablink);
        tablink.setAttribute("title", "focus");
        tablink.onclick = () => {
          browser.tabs.highlight({ tabs: [tab.index] });
        };
        tabdiv.appendChild(imgdiv);
        let once = true;

        for (const e of res) {
          let elementrow = document.createElement("div");
          
          elementrow.style =
            "position: relative;width:100%;height: 120px; border:0.1px solid black;margin:0px;padding:0px;background-image: url(" +
            (e.poster || "audio.jpeg") +
            "); background-repeat: no-repeat; background-size:250px 100%;background-position:100%;padding:10px;" + "background-color: rgba(" + e.bgcolor.join(",") + ")";
  
          tabdiv.appendChild(elementrow);

          let maintab = document.createElement("div");
          maintab.style = "display:flex;flex-direction:row;justify-content:space-between;align-items:center;";
        const muteIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const mutedIcon = `<svg width="20px" height="20px" viewBox="-2.5 -2.5 30.00 30.00" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"><title>unmute media</title><rect x="-2.5" y="-2.5" width="30.00" height="30.00" rx="15" fill="#4be8e5" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13.75 17.76L7.40001 14.52C7.23001 14.43 7.13 14.26 7.13 14.07V10.93C7.13 10.74 7.24001 10.57 7.40001 10.48L13.75 7.24001C14.08 7.07001 14.48 7.31 14.48 7.69V17.31C14.48 17.69 14.08 17.93 13.75 17.76Z" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M20.08 13.99L17.11 11.02" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.12003 14.38C4.10003 14.38 3.28003 13.54 3.28003 12.5C3.28003 11.46 4.10003 10.62 5.12003 10.62" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M18.6 14.62C19.7708 14.62 20.72 13.6709 20.72 12.5C20.72 11.3292 19.7708 10.38 18.6 10.38C17.4291 10.38 16.48 11.3292 16.48 12.5C16.48 13.6709 17.4291 14.62 18.6 14.62Z" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;
        const unmutedIcon = `<svg width="20px" height="20px" viewBox="-1.6 -1.6 19.20 19.20" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><title>mute media</title><rect x="-1.6" y="-1.6" width="19.20" height="19.20" rx="9.6" fill="#7ed0ec" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 4.83h2.79L8.15 1l.85.35v13l-.85.33-3.86-3.85H1.5l-.5-.5v-5l.5-.5zM4.85 10L8 13.14V2.56L4.85 5.68l-.35.15H2v4h2.5l.35.17zM15 7.83a6.97 6.97 0 0 1-1.578 4.428l-.712-.71A5.975 5.975 0 0 0 14 7.83c0-1.4-.48-2.689-1.284-3.71l.712-.71A6.971 6.971 0 0 1 15 7.83zm-2 0a4.978 4.978 0 0 1-1.002 3.004l-.716-.716A3.982 3.982 0 0 0 12 7.83a3.98 3.98 0 0 0-.713-2.28l.716-.716c.626.835.997 1.872.997 2.996zm-2 0c0 .574-.16 1.11-.44 1.566l-.739-.738a1.993 1.993 0 0 0 .005-1.647l.739-.739c.276.454.435.988.435 1.558z"></path></g></svg>`;

        muteIcon.innerHTML = tab.mutedInfo.muted ? mutedIcon : unmutedIcon;
        muteIcon.style = "float:left;";
        maintab.appendChild(muteIcon);
        muteIcon.onclick = async () => {
          const t = await browser.tabs.get(tab.id);
          browser.tabs.update(tab.id, { muted: !t.mutedInfo.muted });
          muteIcon.innerHTML = t.mutedInfo.muted ? unmutedIcon : mutedIcon;
        };

        
        const pauseIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const pauseIconsvg =`<svg width="20px" height="20px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-2.4" y="-2.4" width="28.80" height="28.80" rx="14.4" fill="#7ed0ec" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>pause media</title>
         <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM9.47824 7.25H9.52176C9.73604 7.24999 9.93288 7.24997 10.0982 7.26125C10.2759 7.27338 10.4712 7.30099 10.6697 7.38321C11.0985 7.56083 11.4392 7.90151 11.6168 8.3303C11.699 8.52881 11.7266 8.72415 11.7387 8.90179C11.75 9.06712 11.75 9.26396 11.75 9.47824V14.5218C11.75 14.736 11.75 14.9329 11.7387 15.0982C11.7266 15.2759 11.699 15.4712 11.6168 15.6697C11.4392 16.0985 11.0985 16.4392 10.6697 16.6168C10.4712 16.699 10.2759 16.7266 10.0982 16.7387C9.93288 16.75 9.73604 16.75 9.52176 16.75H9.47824C9.26396 16.75 9.06712 16.75 8.90179 16.7387C8.72415 16.7266 8.52881 16.699 8.3303 16.6168C7.90151 16.4392 7.56083 16.0985 7.38321 15.6697C7.30099 15.4712 7.27338 15.2759 7.26125 15.0982C7.24997 14.9329 7.24999 14.736 7.25 14.5218V9.47824C7.24999 9.26396 7.24997 9.06712 7.26125 8.90179C7.27338 8.72415 7.30099 8.52881 7.38321 8.3303C7.56083 7.9015 7.9015 7.56083 8.3303 7.38321C8.52881 7.30099 8.72415 7.27338 8.90179 7.26125C9.06712 7.24997 9.26396 7.24999 9.47824 7.25ZM8.90131 8.7703C8.84248 8.79558
          8.79558 8.84248 8.7703 8.90131C8.76844 8.90866 8.76234 8.93706 8.75778 9.0039C8.75041 9.1119 8.75 9.25677 8.75 9.5V14.5C8.75 14.7432 8.75041 14.8881 8.75778 14.9961C8.76234 15.0629 8.76844 15.0913 8.7703 15.0987C8.79558 15.1575 8.84248 15.2044 8.90131 15.2297C8.90866 15.2316 8.93706 15.2377 9.0039 15.2422C9.1119 15.2496 9.25677 15.25 9.5 15.25C9.74323 15.25 9.8881 15.2496 9.9961 15.2422C10.0629 15.2377 10.0913 15.2316 10.0987 15.2297C10.1575 15.2044 10.2044 15.1575 10.2297 15.0987C10.2316 15.0913 10.2377 15.0629 10.2422 14.9961C10.2496 14.8881 10.25 14.7432 10.25 14.5V9.5C10.25 9.25677 10.2496 9.1119 10.2422 9.0039C10.2377 8.93706 10.2316 8.90866 10.2297 8.90131C10.2044 8.84247 10.1575 8.79558 10.0987 8.7703C10.0913 8.76843 10.0629 8.76233 9.9961 8.75778C9.8881 8.75041 9.74323 8.75 9.5 8.75C9.25677 8.75 9.1119 8.75041 9.0039 8.75778C8.93707 8.76234 8.90866 8.76844 8.90131 8.7703ZM14.4782 7.25H14.5218C14.736 7.24999 14.9329 7.24997 15.0982 7.26125C15.2759 7.27338 15.4712 7.30099 15.6697 7.38321C16.0985 7.56083 16.4392 7.90151 16.6168 8.3303C16.699 8.52881 16.7266 8.72415 16.7387 8.90179C16.75 9.06712 16.75 9.26396 16.75 9.47824V14.5218C16.75 14.736 16.75 14.9329 16.7387 15.0982C16.7266 15.2759 16.699 15.4712 16.6168 15.6697C16.4392 16.0985 16.0985 16.4392 15.6697 16.6168C15.4712 16.699 15.2759 16.7266 15.0982 16.7387C14.9329 16.75
           14.736 16.75 14.5218 16.75H14.4782C14.264 16.75 14.0671 16.75 13.9018 16.7387C13.7241 16.7266 13.5288 16.699 13.3303 16.6168C12.9015 16.4392 12.5608 16.0985 12.3832 15.6697C12.301 15.4712 12.2734 15.2759 12.2613 15.0982C12.25 14.9329 12.25 14.736 12.25 14.5218V9.47824C12.25 9.26396 12.25 9.06712 12.2613 8.90179C12.2734 8.72415 12.301 8.52881 12.3832 8.3303C12.5608 7.90151 12.9015 7.56083 13.3303 7.38321C13.5288 7.30099 13.7241 7.27338 13.9018 7.26125C14.0671 7.24997 14.264 7.24999 14.4782 7.25ZM13.9013 8.7703C13.8425 8.79558 13.7956 8.84248 13.7703 8.90131C13.7684 8.90866 13.7623 8.93707 13.7578 9.0039C13.7504 9.1119 13.75 9.25677 13.75 9.5V14.5C13.75 14.7432 13.7504 14.8881 13.7578 14.9961C13.7623 15.0629 13.7684 15.0913 13.7703 15.0987C13.7956 15.1575 13.8425 15.2044 13.9013 15.2297C13.9087 15.2316 13.9371 15.2377 14.0039 15.2422C14.1119 15.2496 14.2568 15.25 14.5 15.25C14.7432 15.25 14.8881 15.2496 14.9961 15.2422C15.0629 15.2377 15.0913 15.2316 15.0987 15.2297C15.1575 15.2044 15.2044 15.1575 15.2297 15.0987C15.2316 15.0913 15.2377 15.0629 15.2422 14.9961C15.2496 14.8881 15.25 14.7432 15.25 14.5V9.5C15.25 9.25677 15.2496 9.1119 15.2422 9.0039C15.2377 8.93707 15.2316 8.90867 15.2297 8.90131C15.2044 8.84248 15.1575 8.79558 15.0987 8.7703C15.0913 8.76844 15.0629 8.76234 14.9961 8.75778C14.8881 8.75041 14.7432 8.75 14.5 8.75C14.2568 8.75 14.1119 8.75041 14.0039 8.75778C13.9371 8.76233 13.9087 8.76844 13.9013 8.7703Z" fill="#1C274C"></path> </g></svg>`;
        
        pauseIcon.innerHTML = pauseIconsvg;
        pauseIcon.style = "float:left;";
        maintab.appendChild(pauseIcon);
        pauseIcon.onclick = async () => {
          await browser.tabs.sendMessage(tab.id, { cmd: "pauseAll" });
          window.close();
        };
        const pauseSiteIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const pauseSitesvg = `<svg width="20px" height="20px" viewBox="-2.2 -2.2 26.40 26.40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect x="-2.2" y="-2.2" width="26.40" height="26.40" rx="0" fill="#7ed0ec" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>pause site</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -3959.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M177,3813 L177,3813 C177.552,3813 178,3812.552 178,3812 L178,3806 C178,3805.448 177.552,3805 177,3805 C176.448,3805 176,3805.448 176,3806 L176,3812 C176,3812.552 176.448,3813 177,3813 L177,3813 Z M171,3805 L171,3805 C170.448,3805 170,3805.448 170,3806 L170,3812 C170,3812.552 170.448,3813 171,3813 C171.552,3813 172,3812.552 172,3812 L172,3806 C172,3805.448 171.552,3805 171,3805 L171,3805 Z M182,3813 L184,3813 L184,3805 L182,3805 L182,3813 Z M184,3817 L184,3816 C184,3815.448 183.552,3815 183,3815 C182.448,3815 182,3815.448 182,3816 L182,3817 L181,3817 C180.448,3817 180,3817.448 180,3818 C180,3818.552 180.448,3819 181,3819 L182,3819 L182,3820 C182,3820.552 182.448,3821 183,3821 C183.552,3821 184,3820.552 184,3820 L184,3819 L185,3819 C185.552,3819 186,3818.552 186,3818 C186,3817.448 185.552,3817 185,3817 L184,3817 Z M182,3803 L184,3803 L184,3801 C184,3799.895 183.105,3799 182,3799 L180,3799 L180,3801 L181,3801 C181.552,3801 182,3801.448 182,3802 L182,3803 Z M164,3813 L166,3813 L166,3805 L164,3805 L164,3813 Z M166,3815 L164,3815 L164,3817 C164,3818.105 164.895,3819 166,3819 L166.42,3819 L168,3819 L168,3817 L167,3817 C166.448,3817 166,3816.552 166,3816 L166,3815 Z M164,3803 L166,3803 L166,3802 C166,3801.448 166.448,3801 167,3801 L168,3801 L168,3799 L166,3799 C164.895,3799 164,3799.895 164,3801 L164,3803 Z M170,3819 L178,3819 L178,3817 L170,3817 L170,3819 Z M170,3801 L178,3801 L178,3799 L170,3799 L170,3801 Z" id="pause_focus-[#956]"> </path> </g> </g> </g> </g></svg>`;

        pauseSiteIcon.innerHTML = pauseSitesvg;
        maintab.appendChild(pauseSiteIcon);
        pauseSiteIcon.onclick = async () => {
          for (const tt of tabs) {
            if (tt.url.startsWith(url.origin)) {
              await browser.tabs.sendMessage(tt.id, { cmd: "pauseAll" });
            }
          }
          window.close();
        };

        const muteOriginIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const muteIconsvg = `<svg width="20px" height="20px" viewBox="-102.4 -102.4 1228.80 1228.80" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"><title>mute site</title><rect x="-102.4" y="-102.4" width="1228.80" height="1228.80" rx="614.4" fill="#7ed0ec" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="m241.216 832 63.616-64H768V448c0-42.368-10.24-82.304-28.48-117.504l46.912-47.232C815.36 331.392 832 387.84 832 448v320h96a32 32 0 1 1 0 64H241.216zm-90.24 0H96a32 32 0 1 1 0-64h96V448a320.128 320.128 0 0 1 256-313.6V128a64 64 0 1 1 128 0v6.4a319.552 319.552 0 0 1 171.648 97.088l-45.184 45.44A256 256 0 0 0 256 448v278.336L151.04 832zM448 896h128a64 64 0 0 1-128 0z"></path><path fill="#000000" d="M150.72 859.072a32 32 0 0 1-45.44-45.056l704-708.544a32 32 0 0 1 45.44 45.056l-704 708.544z"></path></g></svg>`;
        muteOriginIcon.innerHTML = muteIconsvg;
        muteOriginIcon.style = "float:left;";
        maintab.appendChild(muteOriginIcon);
        muteOriginIcon.onclick = async () => {
          for (const tt of tabs) {
            if (tt.url.startsWith(url.origin)) {
              await browser.tabs.update(tt.id, { muted: true });
            }
          }
          window.close();
        };

          let focusIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          const focusIconsvg = `<svg width="20px" height="20px" viewBox="-2 -2 24.00 24.00" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"> <title>focus site</title><rect x="-2" y="-2" width="24.00" height="24.00" rx="0" fill="#7ed0ec" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-220.000000, -4439.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M172,4291 L176,4291 L176,4287 L172,4287 L172,4291 Z M178,4293 L175,4293 L175,4295 L173,4295 L173,4293 L170,4293 L170,4290 L168,4290 L168,4288 L170,4288 L170,4285 L173,4285 L173,4283 L175,4283 L175,4285 L178,4285 L178,4288 L180,4288 L180,4290 L178,4290 L178,4293 Z M182.5,4279 L176,4279 L176,4281 L182,4281 L182,4287 L184,4287 L184,4280.5 L184,4279 L182.5,4279 Z M182,4297 L176,4297 L176,4299 L182.5,4299 L184,4299 L184,4296.5 L184,4291 L182,4291 L182,4297 Z M166,4291 L164,4291 L164,4296.5 L164,4299 L166.5,4299 L172,4299 L172,4297 L166,4297 L166,4291 Z M166,4281 L172,4281 L172,4279 L166.5,4279 L164,4279 L164,4280.5 L164,4287 L166,4287 L166,4281 Z M164.01,4289 L164,4289.01 L164,4288.99 L164.01,4289 Z" id="focus_point-[#846]"> </path> </g> </g> </g> </g></svg>`;

          focusIcon.innerHTML = focusIconsvg;
          focusIcon.style = "float:left;";
          maintab.appendChild(focusIcon);
          focusIcon.onclick = async (evt) => {
            await browser.tabs.highlight({ tabs: [tab.index] });
            await browser.tabs.sendMessage(tab.id, {
              cmd: evt.target.textContent,
              id: e.id,
            });
          };
          let mediaTitle = document.createElement("p");
          mediaTitle.textContent = tab.title;
          mediaTitle.style = `position:absolute;margin-top:35px; color: #${e.fgcolor}; max-width: 200px; font-weight: bold; overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;`;               
          elementrow.appendChild(mediaTitle);
          /**/

          // id
          /*
                let iddiv = document.createElement('span');
                //iddiv.style = 'background-color:white;';
                iddiv.textContent = e.id;
                elementrow.appendChild(iddiv);
                */

          // poster
          /*
                let posterImg = document.createElement('img');
                //posterImg.setAttribute('width','100');
                posterImg.src = e.poster;
                posterImg.style = 'border:1px solid green;';
                elementrow.appendChild(posterImg);
                */
          let controls = document.createElement("div");
          controls.style =
            "position:absolute;bottom:0;right:-20;width:90%;padding:10px;";
          elementrow.appendChild(controls);

          // mute / unmute
          let mutebtn = document.createElement("button");
          mutebtn.textContent = e.muted ? "unmute" : "mute";
          mutebtn.style = "float:right;";
          elementrow.appendChild(mutebtn);
          mutebtn.onclick = async (evt) => {
            const notstate = await browser.tabs.sendMessage(tab.id, {
              cmd: evt.target.textContent,
              ids: [e.id],
            });
            if (notstate) {
              evt.target.textContent = notstate;
            }
          };

          // volume slider
          let volumebtn = document.createElement("input");
          volumebtn.setAttribute("type", "range");
          volumebtn.setAttribute("min", "0");
          volumebtn.setAttribute("max", "100");
          volumebtn.setAttribute("step", "1");
          volumebtn.setAttribute("value", e.volume * 100);
          volumebtn.style = "float:right;";
          elementrow.appendChild(volumebtn);
          volumebtn.addEventListener("input", async (evt) => {
            const notstate = await browser.tabs.sendMessage(tab.id, {
              cmd: "volume",
              id: e.id,
              volume: evt.target.value / 100,
            });
            if (!notstate) {
              //evt.target.value = notstate;
              console.error("failed to set volume");
            }
          });

          
          if (e.playing && once) {
            once = false;
            tablink.textContent = tablink.textContent + " - playing";
          }
          // play / pause
          let playpausebtn = document.createElement("button");
          playpausebtn.textContent = e.playing ? "pause" : "play";
          
          playpausebtn.style = "float:right;width:15%;";
          controls.appendChild(playpausebtn);
          // controls.appendChild(playIcon);
          playpausebtn.onclick = async (evt) => {
            const notstate = await browser.tabs.sendMessage(tab.id, {
              cmd: evt.target.textContent,
              ids: [e.id],
            });
            if (notstate) {
              evt.target.textContent = notstate;
              if (
                !evt.target.textContent.endsWith(" - playing") &&
                notstate === "pause"
              ) {
                tablink.textContent = tablink.textContent + " - playing";
              } else {
                tablink.textContent = tablink.textContent.substr(
                  0,
                  tablink.textContent.length - 10
                );
              }
            }
          };

          // volume slider
          let currentTimebtn = document.createElement("input");
           /* Chrome and Firefox */
          currentTimebtn.setAttribute("type", "range");
          currentTimebtn.setAttribute("min", "0");
          currentTimebtn.setAttribute("max", e.duration);
          console.debug("duration", e.duration);
          if (e.duration === -1) {
            currentTimebtn.setAttribute("disabled", "disabled");
          }

          //currentTimebtn.setAttribute('step', e.currentTime);
          currentTimebtn.setAttribute("value", e.currentTime);
          currentTimebtn.style = "float:right;width:75%;";
          controls.appendChild(currentTimebtn);
          currentTimebtn.addEventListener("input", async (evt) => {
            console.debug(evt.target.value);
            const notstate = await browser.tabs.sendMessage(tab.id, {
              cmd: "currentTime",
              id: e.id,
              currentTime: evt.target.value,
            });
            if (!notstate) {
              //evt.target.value = notstate;
              console.error("failed to set currentTime");
            }
          });
          elementrow.appendChild(maintab);

        }
      }
    } catch (e) {
      console.error("tab ", tab.index, e);
    }
  }
}

(async () => {
  const tabs = await browser.tabs.query({
    url: ["<all_urls>"],
    discarded: false,
    status: "complete",
  });
  sendMessageToTabs(tabs);
})();
