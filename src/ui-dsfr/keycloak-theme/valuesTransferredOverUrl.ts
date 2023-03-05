import { kcContext } from "./kcContext";
import {
    retrieveParamFromUrl,
    addParamToUrl,
    updateSearchBarUrl
} from "powerhooks/tools/urlSearchParams";
import type { LocalizedString } from "ui-dsfr/i18n";
import { capitalize } from "tsafe/capitalize";

export const { addTermsOfServicesUrlToQueryParams, termsOfServicesUrl } = (() => {
    const queryParamName = "termsOfServicesUrl";

    const value = JSON.parse(read({ queryParamName })) as LocalizedString;

    function addToUrlQueryParams(params: {
        url: string;
        value: LocalizedString;
    }): string {
        const { url, value } = params;

        return addParamToUrl({
            url,
            "name": queryParamName,
            "value": JSON.stringify(value)
        }).newUrl;
    }

    const out = {
        [queryParamName]: value,
        [`add${capitalize(queryParamName)}ToQueryParams` as const]: addToUrlQueryParams
    } as const;

    return out;
})();

export const { sillApiUrl, addSillApiUrlToQueryParams } = (() => {
    const queryParamName = "sillApiUrl";

    const value = JSON.parse(read({ queryParamName })) as string;

    function addToUrlQueryParams(params: { url: string; value: string }): string {
        const { url, value } = params;

        return addParamToUrl({
            url,
            "name": queryParamName,
            "value": JSON.stringify(value)
        }).newUrl;
    }

    const out = {
        [queryParamName]: value,
        [`add${capitalize(queryParamName)}ToQueryParams` as const]: addToUrlQueryParams
    } as const;

    return out;
})();

function read(params: { queryParamName: string }) {
    if (kcContext === undefined || process.env.NODE_ENV !== "production") {
        //NOTE: We do something only if we are really in Keycloak
        return "";
    }

    const { queryParamName } = params;

    read_from_url: {
        const result = retrieveParamFromUrl({
            "url": window.location.href,
            "name": queryParamName
        });

        if (!result.wasPresent) {
            break read_from_url;
        }

        const { newUrl, value: serializedValue } = result;

        updateSearchBarUrl(newUrl);

        localStorage.setItem(queryParamName, serializedValue);

        return serializedValue;
    }

    //Reading from local storage
    const serializedValue = localStorage.getItem(queryParamName);

    if (serializedValue === null) {
        throw new Error(
            `Missing ${queryParamName} in URL when redirecting to login page`
        );
    }

    return serializedValue;
}
