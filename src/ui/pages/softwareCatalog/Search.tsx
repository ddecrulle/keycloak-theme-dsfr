import { useState } from "react";
import { makeStyles } from "@codegouvfr/react-dsfr/tss";
import { SearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { declareComponentKeys } from "i18nifty";
import { assert } from "tsafe/assert";
import { Equals } from "tsafe";
import { useTranslation } from "ui/i18n";
import { State as SoftwareCatalogState } from "core/usecases/softwareCatalog";
import MenuItem from "@mui/material/MenuItem";
import SelectMui from "@mui/material/Select";
import { InputBase } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { SelectNext } from "ui/shared/SelectNext";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";

export type Props = {
    className?: string;

    search: string;
    onSearchChange: (search: string) => void;

    organizationOptions: {
        organization: string;
        softwareCount: number;
    }[];
    organization: string | undefined;
    onOrganizationChange: (organization: string | undefined) => void;

    categoryOptions: {
        category: string;
        softwareCount: number;
    }[];
    category: string | undefined;
    onCategoryChange: (category: string | undefined) => void;

    environmentOptions: {
        environment: SoftwareCatalogState.Environment;
        softwareCount: number;
    }[];
    environment: SoftwareCatalogState.Environment | undefined;
    onEnvironmentChange: (
        environmentsFilter: SoftwareCatalogState.Environment | undefined
    ) => void;

    prerogativesOptions: {
        prerogative: SoftwareCatalogState.Prerogative;
        softwareCount: number;
    }[];
    prerogatives: SoftwareCatalogState.Prerogative[];
    onPrerogativesChange: (prerogatives: SoftwareCatalogState.Prerogative[]) => void;
};

export function Search(props: Props) {
    const {
        className,

        search,
        onSearchChange,

        organizationOptions,
        organization,
        onOrganizationChange,

        categoryOptions,
        category,
        onCategoryChange,

        environmentOptions,
        environment,
        onEnvironmentChange,

        prerogativesOptions,
        prerogatives,
        onPrerogativesChange,

        ...rest
    } = props;

    /** Assert to make sure all props are deconstructed */
    assert<Equals<typeof rest, {}>>();

    const [areFiltersOpen, setAreFiltersOpen] = useState(false);

    const { t } = useTranslation({ Search });
    const { t: tCommon } = useTranslation({ "App": undefined });

    const { classes, cx } = useStyles();

    return (
        <div className={cx(fr.cx("fr-accordion"), classes.root)}>
            <div className={cx(classes.basicSearch, className)}>
                <SearchBar
                    className={classes.searchBar}
                    label={t("placeholder")}
                    nativeInputProps={{
                        "value": search,
                        "onChange": event => onSearchChange(event.currentTarget.value)
                    }}
                />
                <Button
                    className={classes.filterButton}
                    iconId={
                        areFiltersOpen ? "ri-arrow-up-s-fill" : "ri-arrow-down-s-fill"
                    }
                    iconPosition="right"
                    onClick={() => {
                        if (areFiltersOpen) {
                            onOrganizationChange(undefined);
                            onCategoryChange(undefined);
                            onEnvironmentChange(undefined);
                            onPrerogativesChange([]);
                        }
                        setAreFiltersOpen(!areFiltersOpen);
                    }}
                    aria-expanded="false"
                    aria-controls="accordion-filters"
                >
                    {t("filters")}
                </Button>
            </div>
            <div className={cx("fr-collapse", classes.filters)} id="accordion-filters">
                <div className={cx(classes.filtersWrapper)}>
                    <SelectNext
                        className={classes.filterSelectGroup}
                        label={
                            <>
                                {t("organizationLabel")}{" "}
                                <Tooltip title={t("organization filter hint")} arrow>
                                    <i className={fr.cx("ri-question-line")} />
                                </Tooltip>
                            </>
                        }
                        nativeSelectProps={{
                            "onChange": event =>
                                onOrganizationChange(event.target.value || undefined),
                            "value": organization ?? ""
                        }}
                        disabled={organizationOptions.length === 0}
                        options={[
                            {
                                "label": tCommon("allFeminine"),
                                "value": ""
                            },
                            ...organizationOptions.map(
                                ({ organization, softwareCount }) => ({
                                    "value": organization,
                                    "label": `${organization} (${softwareCount})`
                                })
                            )
                        ]}
                    />

                    <SelectNext
                        className={classes.filterSelectGroup}
                        label={t("categoriesLabel")}
                        disabled={categoryOptions.length === 0}
                        nativeSelectProps={{
                            "onChange": event =>
                                onCategoryChange(event.target.value || undefined),
                            "value": category ?? ""
                        }}
                        options={[
                            {
                                "label": tCommon("allFeminine"),
                                "value": ""
                            },
                            ...categoryOptions.map(({ category, softwareCount }) => ({
                                "value": category,
                                "label": `${category} (${softwareCount})`
                            }))
                        ]}
                    />

                    <SelectNext
                        className={classes.filterSelectGroup}
                        label={t("environnement label")}
                        nativeSelectProps={{
                            "onChange": event =>
                                onEnvironmentChange(event.target.value || undefined),
                            "value": environment ?? ""
                        }}
                        options={[
                            {
                                "label": tCommon("all"),
                                "value": "" as const
                            },
                            ...environmentOptions.map(
                                ({ environment, softwareCount }) => ({
                                    "value": environment,
                                    "label": `${t(environment)} (${softwareCount})`
                                })
                            )
                        ]}
                    />

                    <div className={classes.filterSelectGroup}>
                        <label htmlFor="prerogatives-label">
                            {t("prerogativesLabel")}
                        </label>
                        <SelectMui
                            multiple
                            displayEmpty={true}
                            value={prerogatives}
                            onChange={event => {
                                const prerogatives = event.target.value;

                                assert(typeof prerogatives !== "string");

                                onPrerogativesChange(prerogatives);
                            }}
                            className={cx(fr.cx("fr-select"), classes.multiSelect)}
                            input={<InputBase />}
                            renderValue={prerogatives =>
                                t("number of prerogatives selected", {
                                    "count": prerogatives.length
                                })
                            }
                            placeholder="Placeholder"
                        >
                            {prerogativesOptions.map(({ prerogative, softwareCount }) => (
                                <MenuItem
                                    key={prerogative}
                                    value={prerogative}
                                    disabled={softwareCount === 0}
                                >
                                    <Checkbox
                                        checked={prerogatives.indexOf(prerogative) !== -1}
                                    />
                                    <ListItemText
                                        primary={(() => {
                                            switch (prerogative) {
                                                case "doRespectRgaa":
                                                    return `${t(
                                                        "doRespectRgaa"
                                                    )} (${softwareCount})`;
                                                case "isFromFrenchPublicServices":
                                                    return `${t(
                                                        "isFromFrenchPublicServices"
                                                    )} (${softwareCount})`;
                                                case "isInstallableOnUserTerminal":
                                                    return `${t(
                                                        "isInstallableOnUserTerminal"
                                                    )} (${softwareCount})`;
                                                case "isTestable":
                                                    return `${t(
                                                        "isTestable"
                                                    )} (${softwareCount})`;
                                                case "isPresentInSupportContract":
                                                    return `${t(
                                                        "isPresentInSupportContract"
                                                    )} (${softwareCount})`;
                                            }
                                        })()}
                                    />
                                </MenuItem>
                            ))}
                        </SelectMui>
                    </div>
                </div>
            </div>
        </div>
    );
}

const useStyles = makeStyles({ "name": { Search } })(theme => ({
    "root": {
        "&:before": {
            content: "none"
        }
    },
    "basicSearch": {
        "display": "flex",
        "paddingTop": fr.spacing("6v")
    },
    "searchBar": {
        "flex": 1
    },
    "filterButton": {
        "backgroundColor": theme.decisions.background.actionLow.blueFrance.default,
        "&&&:hover": {
            "backgroundColor": theme.decisions.background.actionLow.blueFrance.hover
        },
        "color": theme.decisions.text.actionHigh.blueFrance.default,
        "marginLeft": fr.spacing("4v")
    },
    "filters": {
        "&&": {
            "overflowX": "visible",
            ...fr.spacing("padding", {
                "rightLeft": "1v"
            }),
            "margin": 0
        }
    },
    "filtersWrapper": {
        "display": "grid",
        "gridTemplateColumns": `repeat(4, minmax(20%, 1fr))`,
        "columnGap": fr.spacing("4v"),
        "marginTop": fr.spacing("3v"),
        [fr.breakpoints.down("md")]: {
            "gridTemplateColumns": `repeat(1, 1fr)`
        }
    },
    "filterSelectGroup": {
        "&:not(:last-of-type)": {
            "borderRight": `1px ${theme.decisions.border.default.grey.default} solid`,
            "paddingRight": fr.spacing("4v")
        },
        [fr.breakpoints.down("md")]: {
            "&:not(:last-of-type)": {
                "border": "none"
            }
        }
    },
    "multiSelect": {
        "marginTop": fr.spacing("2v"),
        "paddingRight": 0,
        "& > .MuiInputBase-input": {
            "padding": 0
        },
        "& > .MuiSvgIcon-root": {
            "display": "none"
        }
    }
}));

export const { i18n } = declareComponentKeys<
    | "filters"
    | "placeholder"
    | "filtersButton"
    | "organizationLabel"
    | "categoriesLabel"
    | "environnement label"
    | "prerogativesLabel"
    | "isInstallableOnUserTerminal"
    | "isPresentInSupportContract"
    | "isFromFrenchPublicServices"
    | "doRespectRgaa"
    | "isTestable"
    | "organization filter hint"
    | "linux"
    | "mac"
    | "windows"
    | "browser"
    | "stack"
    | {
          K: "number of prerogatives selected";
          P: { count: number };
      }
>()({ Search });
