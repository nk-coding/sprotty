/********************************************************************************
 * Copyright (c) 2017-2018 TypeFox and others.
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

import { ContainerModule } from "inversify";
import { TYPES } from "../../base/types";
import { CenterCommand, CenterKeyboardListener, FitToScreenCommand } from "./center-fit";
import { SetViewportCommand, GetViewportCommand } from "./viewport";
import { ScrollMouseListener } from "./scroll";
import { ZoomMouseListener } from "./zoom";
import { configureCommand } from "../../base/commands/command-registration";

const viewportModule = new ContainerModule((bind , _unbind, isBound) => {
    configureCommand({ bind, isBound }, CenterCommand);
    configureCommand({ bind, isBound }, FitToScreenCommand);
    configureCommand({ bind, isBound }, SetViewportCommand);
    configureCommand({ bind, isBound }, GetViewportCommand);
    bind(CenterKeyboardListener).toSelf().inSingletonScope();
    bind(TYPES.KeyListener).toService(CenterKeyboardListener);
    bind(ScrollMouseListener).toSelf().inSingletonScope();
    bind(ZoomMouseListener).toSelf().inSingletonScope();
    bind(TYPES.MouseListener).toService(ScrollMouseListener);
    bind(TYPES.ITouchListener).toService(ScrollMouseListener);
    bind(TYPES.MouseListener).toService(ZoomMouseListener);
});

export default viewportModule;
