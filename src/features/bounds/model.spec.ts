/********************************************************************************
 * Copyright (c) 2020 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import 'mocha';
import { expect } from "chai";
import { SModelRoot } from '../../base/model/smodel';
import { RenderingContext } from '../../base/views/view';
import { ViewportRootElement } from '../viewport/viewport-root';
import { SShapeElement, getAbsoluteBounds, isVisible } from './model';

describe('getAbsoluteBounds', () => {
    function createModel(): SModelRoot {
        const root = new SModelRoot();
        const node1 = new TestNode();
        node1.bounds = { x: 100, y: 100, width: 100, height: 100 };
        root.add(node1);
        const node2 = new TestNode();
        node2.bounds = { x: 20, y: 40, width: 10, height: 10 };
        node1.add(node2);
        return root;
    }

    it('should compute the absolute bounds of a bounds aware element', () => {
        const model = createModel();
        expect(getAbsoluteBounds(model.children[0].children[0])).to.deep.equal({
            x: 120, y: 140, width: 10, height: 10
        });
    });
});

describe('isVisible', () => {
    function createModel(): ViewportRootElement {
        const root = new ViewportRootElement();
        root.canvasBounds = { x: 0, y: 0, width: 100, height: 100 };
        const node1 = new TestNode();
        node1.bounds = { x: 100, y: 100, width: 100, height: 100 };
        root.add(node1);
        const node2 = new TestNode();
        node2.bounds = { x: 20, y: 40, width: 10, height: 10 };
        node1.add(node2);
        return root;
    }

    it('should return true when an element intersects the canvas bounds', () => {
        const model = createModel();
        model.scroll = { x: 80, y: 80 };
        model.zoom = 1;
        expect(isVisible(model.children[0].children[0])).to.equal(true);
    });

    it('should return false when the viewport is panned away', () => {
        const model = createModel();
        model.scroll = { x: 150, y: 80 };
        model.zoom = 1;
        expect(isVisible(model.children[0].children[0])).to.equal(false);
    });

    it('should return false when the viewport is zoomed away', () => {
        const model = createModel();
        model.scroll = { x: 100, y: 100 };
        model.zoom = 10;
        expect(isVisible(model.children[0].children[0])).to.equal(false);
    });

    it('should return true when rendered in a hidden context', () => {
        const model = createModel();
        model.scroll = { x: 150, y: 80 };
        model.zoom = 10;
        const context = { targetKind: 'hidden' } as RenderingContext;
        expect(isVisible(model.children[0].children[0], context)).to.equal(true);
    });
});

class TestNode extends SShapeElement {
}