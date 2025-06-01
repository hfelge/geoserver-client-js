import { describe, it, expect } from 'vitest';
import { GeoServerClient } from '../src/GeoServerClient.js';
import { StyleManager } from '../src/managers/StyleManager.js';
import { loadEnv } from '../utils/env.js';

const { baseUrl, user, password, workspace } = loadEnv('.env.test');

const client = new GeoServerClient(baseUrl, user, password);
const styleManager = new StyleManager(client);

describe('StyleManager', () => {
    it('should list styles', async () => {
        const styles = await styleManager.getStyles();
        expect(styles).toHaveProperty('styles');
    });

    it('should return a specific style', async () => {
        const style = await styleManager.getStyle('polygon');
        expect(style).toHaveProperty('style');
    });

    it('should return false for a non-existent style', async () => {
        const style = await styleManager.getStyle('missing-style-' + Math.random());
        expect(style).toBe(false);
    });

    it('should confirm style existence', async () => {
        const exists = await styleManager.styleExists('polygon');
        expect(exists).toBe(true);
    });

    it('should return false for a non-existent style (existence check)', async () => {
        const exists = await styleManager.styleExists('missing-style-' + Math.random());
        expect(exists).toBe(false);
    });

    it('should return false if style is not in workspace', async () => {
        const exists = await styleManager.styleExistsInWorkspace(workspace, 'not-in-ws-' + Math.random());
        expect(exists).toBe(false);
    });

    const testActive = false; // set to true if you have a test layer and SLD file configured

    const testStyleName = 'test-style-' + Math.floor(Math.random() * 10000);
    const testSLD = `<?xml version="1.0" encoding="UTF-8"?>
  <StyledLayerDescriptor version="1.0.0"
      xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
      xmlns="http://www.opengis.net/sld"
      xmlns:ogc="http://www.opengis.net/ogc"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <NamedLayer>
          <Name>${testStyleName}</Name>
          <UserStyle>
              <Title>Default Point</Title>
              <FeatureTypeStyle>
                  <Rule>
                      <PointSymbolizer>
                          <Graphic>
                              <Mark>
                                  <WellKnownName>circle</WellKnownName>
                                  <Fill>
                                      <CssParameter name="fill">#FF0000</CssParameter>
                                  </Fill>
                              </Mark>
                              <Size>6</Size>
                          </Graphic>
                      </PointSymbolizer>
                  </Rule>
              </FeatureTypeStyle>
          </UserStyle>
      </NamedLayer>
  </StyledLayerDescriptor>`;

    (testActive ? it : it.skip)('should create a workspace style', async () => {
        const created = await styleManager.createWorkspaceStyle(workspace, testStyleName, testSLD);
        expect(created).toBe(true);
    });

    (testActive ? it : it.skip)('should delete style after creation', async () => {
        const deleted = await styleManager.deleteStyle(testStyleName);
        expect(deleted).toBe(true);
    });
});
