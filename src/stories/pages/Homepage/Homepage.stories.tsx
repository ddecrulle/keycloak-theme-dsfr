import { Homepage } from "ui-dsfr/components/pages/Homepage/Homepage";
import { sectionName } from "./sectionName";
import { createMockRoute, getStoryFactory } from "stories/getStory";

const { meta, getStory } = getStoryFactory({
    sectionName,
    "wrappedComponent": { Homepage },
    "defaultContainerWidth": 0
});

export default meta;

export const VueDefault = getStory({
    "route": createMockRoute("home", undefined)
});