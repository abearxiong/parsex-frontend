/**
 * @licstart The following is the entire license notice for the
 * Javascript code in this page
 *
 * Copyright 2021 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * Javascript code in this page
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XfaLayerBuilder = exports.DefaultXfaLayerFactory = void 0;

var _pdf_link_service = require("./pdf_link_service.js");

var _pdf = require("../pdf");

class XfaLayerBuilder {
  constructor({
    pageDiv,
    pdfPage,
    annotationStorage,
    linkService,
    xfaHtml
  }) {
    this.pageDiv = pageDiv;
    this.pdfPage = pdfPage;
    this.annotationStorage = annotationStorage;
    this.linkService = linkService;
    this.xfaHtml = xfaHtml;
    this.div = null;
    this._cancelled = false;
  }

  render(viewport, intent = "display") {
    if (intent === "print") {
      const parameters = {
        viewport: viewport.clone({
          dontFlip: true
        }),
        div: this.div,
        xfa: this.xfaHtml,
        page: null,
        annotationStorage: this.annotationStorage,
        linkService: this.linkService,
        intent
      };
      const div = document.createElement("div");
      this.pageDiv.appendChild(div);
      parameters.div = div;

      const result = _pdf.XfaLayer.render(parameters);

      return Promise.resolve(result);
    }

    return this.pdfPage.getXfa().then(xfa => {
      if (this._cancelled || !xfa) {
        return {
          textDivs: []
        };
      }

      const parameters = {
        viewport: viewport.clone({
          dontFlip: true
        }),
        div: this.div,
        xfa,
        page: this.pdfPage,
        annotationStorage: this.annotationStorage,
        linkService: this.linkService,
        intent
      };

      if (this.div) {
        return _pdf.XfaLayer.update(parameters);
      }

      this.div = document.createElement("div");
      this.pageDiv.appendChild(this.div);
      parameters.div = this.div;
      return _pdf.XfaLayer.render(parameters);
    }).catch(error => {
      console.error(error);
    });
  }

  cancel() {
    this._cancelled = true;
  }

  hide() {
    if (!this.div) {
      return;
    }

    this.div.hidden = true;
  }

}

exports.XfaLayerBuilder = XfaLayerBuilder;

class DefaultXfaLayerFactory {
  createXfaLayerBuilder(pageDiv, pdfPage, annotationStorage = null, xfaHtml = null) {
    return new XfaLayerBuilder({
      pageDiv,
      pdfPage,
      annotationStorage,
      linkService: new _pdf_link_service.SimpleLinkService(),
      xfaHtml
    });
  }

}

exports.DefaultXfaLayerFactory = DefaultXfaLayerFactory;