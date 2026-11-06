// ==UserScript==
// @name         Discord PowerTools
// @namespace    https://greasyfork.org/
// @version      1.6.0
// @description  Local Discord dashboard with themes, workspaces, saved messages, media tools, focus timers, link cleaning and performance diagnostics.
// @author       KyleAustin85
// @match        https://discord.com/*
// @match        https://ptb.discord.com/*
// @match        https://canary.discord.com/*
// @icon         https://discord.com/assets/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @run-at       document-start
// @license      MIT
// ==/UserScript==

(() => {
  'use strict';

  // Run only once in the top-level Discord page, even after accidental reinjection.
  if (window.top !== window.self || document.documentElement?.hasAttribute('data-dpt-running')) return;
  document.documentElement?.setAttribute('data-dpt-running', '1');

  const APP = 'DiscordPowerTools';
  const VERSION = '1.6.0';
  const STORAGE_KEY = `${APP}:settings`;
  const SETTINGS_V3_KEY = `${APP}:settingsV3`;
  const NAV_DATA_KEY = `${APP}:serverChannelDataV1`;
  const MESSAGE_DATA_KEY = `${APP}:messageUtilitiesV1`;
  const MEDIA_DATA_KEY = `${APP}:mediaAttachmentsV1`;
  const FOCUS_DATA_KEY = `${APP}:focusProductivityV1`;
  const NITRO_COSMETIC_KEY = `${APP}:nitroCosmeticPreviewV1`;
  const NOTIFICATION_DATA_KEY = `${APP}:notificationControlV1`;
  const PRIVACY_DATA_KEY = `${APP}:privacyTrackingV1`;
  const PERFORMANCE2_DATA_KEY = `${APP}:performancePlus2V1`;
  const STABLE_RELEASE_KEY = `${APP}:stableReleaseV1`;
  const WORKSPACE_DATA_KEY = `${APP}:workspaceProfilesV1`;
  const SMART_SEARCH_DATA_KEY = `${APP}:smartSearchV1`;
  const DASHBOARD_TAB_KEY = `${APP}:dashboardTabV1`;
  const RELEASE_CHANNEL = 'Stable';
  const RELEASE_BUILD = 'Public Release';
  const LEGACY_THEME_KEY = `${APP}:activeTheme`;
  const LEGACY_THEME_STATE_KEY = `${APP}:themeStateV2`;
  const PANEL_KEY = `${APP}:panelPosition`;
  const LAUNCHER_KEY = `${APP}:launcherPosition`;
  const POWERTOOLS_ICON = 'data:image/webp;base64,UklGRrAiAABXRUJQVlA4IKQiAACwbgCdASqgAKAAPj0YiUMiIaEYq96EIAPEtgBXJ7Hg99Y+2D3GKt/dv7T/fv9h/a/cP1NdQ+T5z3/3fu9+FHqc/SXsB/r70rP3c9Rf7a/t17uP/O/bz3Y/2P/c+wR/Pv83//+w6/dn2DP239Nv91fhL/tH/S/dz4GP2m/+HsAf/Xd2pQHFv9V4O/j30X+b/uH7g/3n3BspfX1qL/Kvv9+1/vP7p+zngj8f/9X1C/yX+j/6X+yful/cPin+q7va1noI+3/3T/gfnB/j/Tf/w/Sn7O/873Av1b/3n9v/eH1t/GH9N9gP+if3L/nf5n8yPpj/tf/N/o/zT91X6B/l//F/oPgI/mv9e/5P+F/yX7P/O97Mf2m9mv9tnYCKKizpWTzZ9WbKJe6OlIBiQnJHWXJN6+VTWBRcCaMP5+yfmtEmet2hCLp5rt1fsEiW8qAutExGIJjgqtM3ybBMWzxzCvHS8oYbcPx0aFwU3MYiOooU6wgX7R5ZP/lbszvMgTaExxZracI8GZ/eVG36hW7j9virhmshDWtGvOy2TLhujiX77t8afyEcpezykVz6uG/z4PKUvNuVboj7I0i8gV7xFOuNNW3GqT63AMqNhSekJz9E0P+UB8vvJAn/PJxGS07b9oTh6mcoJGlirfXIwlFTPvNWp0KopwV1dNq1jajDUAFhSzNOF0Mt/7PpSCyPLbWRJPe46NKcehVdocTK9m8B9NEnp2CxrB9y7ddmIQVG+j30P83qp5dbqUCj4V0Bw/DJU2RIwTzBuj06GnR9FMiUDY8P8AsztzIMwoY7fETom68esg1c58ePsBwD34e5Wqv/A/HbrozQc0fznRGLtl3rblacwnDGJA8lGN0s6VNuSOjHdk4MtUEiOJdtSmcrT9pbBKA1hrriwc2fOCDoiiSaINVq4Mz1BBcX9USwJhE00ERpBL8E4bEDRyGOPoi+H/1eKL2hI6e0e1NthUk5mM//9r5gyyVeEy25Ewq8oQ8BjdNn0Rv7mf3mWvVaXTvCz0PMEmnGir/N4/h7FqBeNVOIfYVPhMhjoumxZP+sb64hAd2oJyK0SWUWnIuDAPSqi9P1lheaPv4Ig3vmYmlbh85viMG95qc2N541NmpXyRKS/45bQyuuU8mpKBX2TH8ZuPpY7LPSzvLjixMNwuIUmAJZ17dQg80tPvD1o1tRfMtnKgAA/v8so1C+vLtwV+JhzsyDazzv74J9EcOYvJTEg6XYIw7OYMgb5UJ93UYhlS/ccmTran7Vlh0fG14WS/6nkKGstonxFGYWkRt11TR/V7VNTUkZr6F+mx1c16M80uwfBk93qT/muySGviYlhU5foyGNuqiv5Dmb/838bjCr0ehoztkBVN6N+/R1sI0pIWrOaJfj/prLAlh1Ckd9RM4byCV430qBwMMptLyS2orfA+/qyn1fiiBJL1TyO/rjzf921ri9uWeIZ4bPPwz7+xweXR48Q/GLcxAGmpGW4nk1aY5SMUs8RiQiqWeNtf9CKsB5/kmbx6BoIuvPUBfZ361s08kSO0xFcH7/yDOQIha/7bSC5Z7tv6FUI+Du3/OzwjSkfCFbIZ+CTeUNg47AkUUcVg3R8+tCK1qbxNTx5VQmUyPsT1ncMZIQD3MclhL5/W6rmm9guoV2ACICw53rgZpS3RP/Km/i4DvBoXqHzy/H0oYKdrqbrTBFdd1ehrH+jx+JBO3J+TTb6zBvblHgr/2ZGXVNqHQpZAnkaVZ0gjcPu8PcZ1lzAyXGEz1IospJH+w1rvCga3qgbmnBzYoYOqzivIExAqRImDEdWDyxmTNU41yrbzFnvEgE+Zrv0b23MayqtU3q6fLac/dRtqWNH1F5XCFE0vgFkZNrnQ4EwjhvwFcZ2aIC2CjiV5AkrrobczrzcYHIZUCTdKXNHF0Kc1U0aLuZxTUJ+HHpH/Oj3QwjgjpPCXFxyrvnizFD5gsOkoWiZ0AK6ndas3okHDC3o4bdxVKVltpKGMl6ZeoD4IyhuElsOVP5uImDTnAaossegJe8uocXHEUw9DMXFb0g1xQpTtAxm7z7FouJEIJr9UFeeGFjDxXCiFEQIXrxzQDRV3Fp5L6/FyjSBgi2XTUDaoOGq131chSU6/liWI8ZCWITiw5TRnUXvosXEbvxDj6KJK8/iQozVKswFiNRN7U9Nf7oQyGdd1vT+ZiAlfqp/ZgnwCvGaC4mGPrJ8b6CFMBD4Ey2i+jIOjpdkMT6K/Cs+cDHmwG2icD3e5HSe1PGJuz7CosO0fAZh8sQj62UG0VY47NuuMgg4WQp3d3TEvf812mfzF3we9BOOEx/3rhE+LiQiplndqMfoZx6x9zqZRpmh+3U4vooS8ICxgEbBGGu+iCAHBnkBeSi7oEMjGRhYDxJzGuTG7knvKLDnPZ1locqzxvHDiY75mkf8JLJCgOsGnNigdG2rtGrbio3KiKgC8NC1HjzpIv3V/JTaQNwF/zkRUZm76fhQGsq7IuEVii67h/VXENZYL7CG//FthCVPN0HJ/2iR8g8wjCWyZGB9dI1hp5R4enlRn/oi32bGFGOJx/qu0Hfiw02Cwz9QWwdnH/IUPtMGpWv4WVfLC9NWjGCFG0/LvJdYXcwHzZFirJ6J/ti5Ub3pC7GasFXsX86HMmq/py/wtvnme5ZGVXN+9qu+7aYIB3bzBrf+e9Q4cK55vuoNRlHmXLAGwBuabH/QeBQy9j7mwbgdZd/s1vxp6OL3PbrJMmYZCyMC0wiC3lSoPgR/HY69c6EGc3JQKU+E7/IybfmwsIChfgRKs0xtb5Nu80Av/BnwXgoeGf9cfXzr1BN7Xg0xuYk0IUMfGaN/LnDhYgFM7RGitVhARnJVStaQvVy3auOUiT8Yj1aP/5Rk1L/l/e6FdSo/s/F/1JwdRWDpw8H2/w0l3Kz0OeIJoMlQ1V4OkAjGQXyMeTfHR5POfnfMYXt1Fm3n18CjPY//Fin7PowKo2CasKFzlUontY1l08gnXXEN0zP7e/tmEZHTZhJOexjJGWxfqK/kP4jgQfw3zxS56g3AvJgeD+5pdJkn45bn1G5llXfVImikFLNqlvho0u9VO1d0gjGDKzMJu5iljiPW8M+bBTqgIYO8QrOzqGyZUMANBy7lyAoZmy7w4Gr6C1oJxGpDFfDkp2TuGf8qtjcknlv+nfuVDdBVluqxhQJymRn0h/MGspB3TgGdrHeRme400ntC5ET3e6yCnlKjjc9o12T8oe6nczP36ODoJr+6mQnjTCcUAspzAMFTVF6JJ7Ewj5VZM8gFhhPc3g9Bnf90dKT0ooSwLFvWc/W81j9SU8ATPo1PaeIJWMAOs1hnQJWSnDpw46QUPqt5rbj+zy8VcVrHqw++0RhTUJEKI7oOO1IhWZwp/EFl9gxfpMKtc1E1YS+/tY/igubEXlvJ6D2vLuXqtnXFoFmeDLfmL8FIBG/6bJKFL2DBhmFl7jSNGhu1WYHwqISwXXNTyLsv3er2Umao3BElMX25EQzF/VmtjXNqbpKPHYkvm0Hv6WUrVZHTW7Z7/FilsC+wdaM/xi+J5fRbfCcHdxJoQxz7qPA/6n5hNCizB/70GTFav4C0uMvSvojUzPQTtTwenQ/iIa0R16fXIJIhwevcuiTt6XruSdDUgm+LLDKfpqGW1LnvDAROGFiwBEhltluuCeA8dJN/hG6P83+x/UQ5jtCDBbt31suHX4KEKixI4kOpNb70If1+a5HRf7lwOFv87s3zy7FM9ow+I1L0ahkcRqO3cXswGWuEWGM3/sH75MB3uqgnEHdFQ3zNQiVgtKK8XpRwmkiLF6POwSE3MyXsWLhnYHU8psaFbh6n5fqRAfnL/Fj58hU0Pn+fgHm2p2L3D/R7H+YzDyKQJafmWorDLrt0KeJb7QR3Zgk21bBW70IbGZshOnBRcUuOhNjZW/3d5pQDOANw2t85AXRpgrb2YCZltnFldBfoylmFrFQYLhwe8+yZdl7zHSN26izYQvW9jlpk865paRSaP0o7kfKrF+uEpnuijBVmBhAQ7Uqm0NAsAAWodPgnk3cNnN9OP3OgifMPPc7eXdnUVnJBh+A3RyWr/4X4+6WCdFoNsUVvVIvbzbUksGXp24cItpJLKIoDQZu0HYuQPOf5EPg/D+nORO/B87/PbIWBaUJdhbMosOB2kBSJDiFhtPTkyYGllRMC9zCvXGp0dJcGIT4qdnjMGyjhQG8sxNZh9ZGAXZzGRUemge3yMgwwfopG6eZTVEeKE8ldzn7bF+CvVXnw+6dt2oeFrGBSCJoQ79gyPsIJY5vKWf55w2Suv5G0SgsiVlShzkw+ecYhcK2AUIHh2EgkZ4SPV1RQa36T/hJR3Ny7GFwrCP4VGXcRKN2aSGw9z4sYwhuBW9ZErinDXhc3cSw7Qt9QGemCRhakAn4hxKjuYBsLfvGtIWc235QXrVgSDb1siG0Y4fRBfkkT+dxB+SwN5tb0NvBmUg41b0jPNAoE4ptF+bk3wHYYQbf/QhGuvyVOFtsxRcdMh8F15y9Cghz1gDPagK/Aln0VKxudN8j10h4NMoa8bjZ5twJoF7t80fAW98HUUjhxIaC2By0ox00gonBFe/QF2UU4eIyVfwv8FiK/t6anjGtutl5yLu7n0JXz5YeW5xNI8+qFaDG/PY+rnVMOiHR1zwTqegfgl60Okvxb5qrq9QOXHVySEuGMaw8Y/3vUt+DM3I05+kjR6T6SO4AZcl65/L4CvcFUD10mEYw6VaHvs46Ae8nPzQnhppzztAYK3Bjite7JOIwaW8k9y0MwyYix6427KWymFNkndTCaYWJdTZxN0JbdjS62Z7C3ej91ZLGBXqLGw7SR/ad61ohTJ2Mh1KOfQRWtzSZSrLUZ4jcDFbiq6pwmkwHMHZWqEQ/UDFesfsKHVIOUUiid+7tbVQ5Of4NgdHr4IXg7vfi/O2HKLeCFf27+8uxHaNfCGUA7E7WLxTbi04u8uthyPV+e1sqjllfUASbtMK7Nvoq6jLIDpB2tIk2AdXtJGgqT5J5aKR2el9cibmncfb0N1HrtlzjJwLh2Fy92Bh/p6YZEHHGjq1b8SUMJ6qaYA96mCKn0kZnW91BjKoHUJcnbUkUbDbzMIHLondrMLh4yjgifBvLYYav+pXtrz1HtGKNmplLpWcpWVKHdelY+U0rrhvQAd6qwdxdaMEPbLQFIn/97X7wuzX43F9ZqpgKfrRZeEijLvqSMUhnJ//H7+yuVTlbeV0Vv3w7APznqGSfF815hhEkwYm4hWKGpsyHHMIMKh7tClz0oIFlb/oF/aBhELJveNkBkqp537TGh9rqqJv8RYTlG0EoXz/nlplurGPcGZN/ZE0rn7kPR2EXrtC3GcMbXDGbAo50h4NrRLNewqjEseWyMLTpHesLgNOzw3ZU2PIA+NTlJbQvT8JS89ofxMAxP9GBTddUCAYD7wqf28AS+MVdvA5jurpVY3IBlNR2rZseSeQ4OdBmbZqDeWUYEONi1VVbQn5qrmQPPr3bBZUs52Hp3NHYwOJlE/1TbyL+NorDyFVX4ii/E4FDX2I28Vnw7j2wHkWM6YREu6rxLUZcMyIBc9gr4dVc0AKOc/4XvHLf3vv9In4SnF09nmXKMJgp2YMXpwY4w9ILLnVdsh8Nl3vyFxBbDfONhf3C1JAdf3PO3X4CRA6ANILkFK5EgxC1BfTYd/bi/p3pPtoGe0cXBnZyGCfxuhgsAhoBzaSvTTutNZsYTMoaJabx/gI6jrYQ0kibj8gWjtUr7G4fhlDlk3a+TVaBEhfoCnu+Cg83fj9G5UOHTAaGC/g29Jgn/h6z8oUipufK2X1kDDAw8vYRPm7QrlxRAEmOClmrmEKShNZ/00hCQGcL7kAnFGnls4efK0Q805oub2qudGIWLEKxRZFVqB7s1s9cPh1cFUihgx4s9+d/03Q65onGluVfI/CKVKYAHk4TeCY8FdKy6oy8u6cLU8DkZaR+8vWntl9d1CGERzBRpNpTots/+Rh0eVxwWX/jzPTI7SGfXA+jWbBNfQnSQwnfZrCSU9ukY0y6Rbq1ffgxToyt71D4R0KOj7zcfLA2czwlx7zcnlPGsZQeAXs3OkZfeU13RWjlU2GTcTImRGnIhyBDSbRim5KW8oQai/QvyS2ZoFNzjTNFALvHMKk/Dbs2TBtutCIsFt5lSb+q18NA6s1LOAwab/nJJFX/jdeW2uLkSI5wVqNvvPyZVBC3kNgAY63LFrj1YXDvMr1LtnH3C5vGAsnHxjsYbB5SuvJY14pFSiOyP9Ygq4OX/st0tAmrRlrPbpKO6Ek3+eAppaDlOU3Gt71qHkJeV4gCdUJUT+OYpGdJFHbjuYaFCZk0RCGhGT6tZB3Oj2iOwvxarL5RWk8oyE8HA8EluTz67Toxct0TfPXU5mY+05nXSrAPVejPxjSsVXwZCexPBTXnZABxmngTCZzdSyIKcuuv7qT3l77N0KbiSzbSfkbBMdeb0LjW9J8d3s9q3kMJ6JnUrKA5uzjNF1g7Gg3OUQwwzgMz3XhnPgWTqv2RTG/4nilHEh+F0f98YmrOesO2Yu2brbPi9vhb4TX3+a4OYhHH2o0/jS47Uz0cDmMfZWosvPnvLthPIEqJJ3dw83Wfxs2DFLw6S+YOFoYk82Stbb32sNo6SmZNmmrIHireIecy8W/lfSjJI+6gZmF9NBzr6+LS7tkHIIP5YA+Pu339AS6xyOwg01hZkXNsE4aZYFhvZBuUZxSgNWtL2sRY9oV6xWu3WKKyP0WgdQYt+t0lAe9h4eyYu2Lt4Y72ToUT9QPSNFiAlU4OYC1eLUxtSW0ZF70cT0vNKz2qtYGVgGQ5Pu5+HLns0eWtLB4cPiwolY8u4otaPIP+XvdjDRrjSOtRu+hlom1OJWM5Onaux7x8o/bkGzDs8jDUzkakqWpyzcPEqpvnZhUSzKhtwpz4Iv0sSOGTR7le3ixND5W06GBletMt9N79kND5goLdrhyZP5N7+96zgqnS6pRz7TESWfKvdBjT2dXgIn4HgDbHrYDx29x0DQhsorO7hUx9BPb5eDwdR3p6pgcBtTmmOUsPHTYd0JXNkJgkb3XKd5tRahIpgcQklxz+KGvnds//7VAauVApMDSme7oR3X8zaLHE/eDRC/D+fWIjdnSLgr/vYGinkRTQ1CnQsj3iM7fd2kENRpvoHBQZoCdrUIpOXQyM240H42v1M5hw0i53HmrU/B8yvKX7t+RrMbN+6YZ7v0NJt+4nQaEB88ywmEkCmTeR8/dx7EC+DRkzU4iRaOYP7clgG6jk2aD+PIMMPY6lM7HGCqWonrkeOH8X6eh0hqjJ0w56y31Zn5t97HagdTfDvXEt+4VIsSzkLOc5QjArxn0p26345MXXnqGpCYml9Ze5x7qJZGeviLL2ISPCzMa9J2LDwlM3JQ+vBEqKoIYD7s/rkiiabpoigNjKCuQDWjTHM8OX28EMY5+gX5aBvWH4OsrLZj3Llh4HK5IOLIVAfEF2g2Kn2zh+W9qaxqJIwFWHpvUlDkzVQEyR93hyMgZ3EpCxcIWb8Hj1EJr+E2RmTULPksjdQakaGJNeyZYLeewzuInA03zy3kXRR8X9DKqFwxcoVPdflN39fBsNSmE1ik+FdVtBx7l6xsG2cDWRL7lprMvfOVmczKgHhNTi0m4937VtNLuW3V76kAWbmPUVum7MYZmEjVop7HvyD69Bdg2Y5vGrZAb11ns0RXL/8tmhXB3NvFalCx4o+Y51SaRVLYNyCB6Zp+aOVZNDbFDDau466rgod/hEXEzVYOSAMrqyCOSsRPaDRfMvB6pnI1epIhz+nSHgZq9erSbJ8ADCDSv4XlDas/EErH9gR1zDPzwnBt1yTT1ItW1HWypbP5b+pkg/owv74w1RIhTPS/8KbE60ca8SXRIV6xmN/f1h6F2Ig7SSL7QjvPsi09kpUiG/KASfHJ12MKxg4FCS95ocrMEFCm51SyYZ1eWYwc8Vy8aU8i+adH+vffCKHm+QO6KPaIaV/iA9cdvK3qMaTdKfotpNPDszj/cBvcuzJlObI6HDhnt0BbVQJGNitgzxJ/pXY+HTRRmzJPIkX/egbhQA1KmAJZ/wCltLQWEcaoZZnPdFA3dNiF84NOQtZuU5qORglNfh7I2xmTwU4TnpaEnVxV3OSaA0t7PS2Nw/6yf14Ai2RlIfSvTUcwNOCTjWgPaLD00EqQBhxKkfbNvqoJwElP3+pfXUAwCt2gH8c/rf2qiN77LkgmyVz+FMt3n/NGoCb6LlTLrOEfxdR/DDEQtomIZyT4c+k26LN7XRa3Y9yrMOJYdn/xEhGcrYwYxv1gQUVMZAlNDoBnfq8/6OGLJo/e5/2fafGl5bUOAmksPvm0pWP51hD3jSfgE1qWqjMixphYpm0aOqKjpTXd7aNv5HhIvyPx/f6659fEbCAyQFxjmKvATdvIGG1bPjPrb+OsySpZ7nVZYsPsLlEVCR6W4gImRK+899nUzukN9z0MioC4KouNM7NRhYv+n1KPkq5pIQEAc0+89NW+JA2cK9SxqOCqqGvpJeL2rhPGZb/t5+u1I+yuL/1YKq0V1EuEFbO+dvTKNr/A23ezk4PBV8zTXzbrc1N8+3X1hjmS+mVZiuOc29464QkWwtZWf2G4jgWxHqk/p3veBVHWLOa2bwfmcDB7iaDajhN/W/UH3wuXc8sRORt0sTnKXR11r34sdf/cNVK43d+LvZWUkwlIFpjIHaYH39XhH0B8Tg1dxM3q2SpHmoWDXlTYy4x2P6h249tcXlWtC2IyofxFsgsNJr8YilOv2YyJjs3dmgecmr/rIfauIlRWAb62x+v7ruG8TVh/y2aPKFffJMJgu87JalwN5170+0/3zOfCkT1t0G365vXc5C5uQZJNPsyB0L+LKOyXo+VpOelcNC1LT4FnuiPUDmf7+XD/JEoa3kg0zP/mobUDyLdct+XyTJOC/wji6wnry547QTxrbFveplAkeTGmt7wEr5ZuqFtfR/oAORKlmFfBR/669hg6HRZIT/hF+XExn4fsu8cX0UUwzHo4ytfN0kMR9Nw5PW8rnS13oXJ6WwZTmLBZOlyOoDCi4t9DiuwvBrF5+ddWOXSS6fsXpguPCkwp44Wbbjy/vH5fGnSE8vknIGhu4MT6CDrOlzkvQ5YtYmYY2wBAChAc5PPPnOXq1f0Wr5XANYNeXkJlK/mWn1Mz8lS/E11E6iVxEp5XFIKhLV71Vsk6UXlbxMevMt9llBGlq7uJGOZXz6zxHh19l/9B8ApWjiX82Aq97ANeNPf+uszXGA2XSLEjTb2dZ7Qsz79NPvjFviP32surBSi2GZgzRATMavuQZYGCvE4gxps5Z2P6PMeG77wkz52HQX847M+EXbYPD+qdyvb0jsdDnyl95mgmfhlXe0b8Rr6iYXT3qLmKqRPvSxnXV6VZdCTjbzqljq5c1wfZAkn0kNDqOmE01Rv7qsDujtUe8cVgDdgem8R0C8bokOyCZ8Jy2w/DJHbvZk9LgUIWV2yshiGmEcIouiCvWFkFWnTpZVEUETjb4xxwpxOBDAkkaJka2u6lzFjPvRKMMdCar1Sfup5Mr5eCGZ3Gd8xBRyK+ad7T5T3pAGlvEMYFxBFtTc3AH9DIQ6SKN2BVF9OYXYDSdOZ8jmr3YGs4NZEd4sNBBhPB4y/h2/qAECYsyo06j9qgI00Wwdi4i+j4vvurXzjAvSsVf3Xh/nzM8dLMx9K1RlARPjmfiXYR5Gbap9M8YPZgpGRUtaWxwS+42JTbGTEQi7smzqHMstcrOLo8y6zP4+6Ph9EIGSYyrIb8zAluZe2inR7sz4IekRYecFxUX+7N4HH2QOWMgxF9wpUfzJlXs3G8DE1OduFSaaGTX76G2bkiNneyINg/nCyCe2AbUHWOb/oZo8pZIL9DaEWmsl5BR5poesNNUKSulVYZeXSotQW5GZ/QxxXpqE5NkpRMWVEbSkxatz+Yxt9LO/9bRjRyIUTMxvmK/m5PFMz3RuBHoWkuT3jfFkNVjn0N48WKYvokznKZ17EGPoxU5GFa8vm0SYePslglRGS0SNE5UFY/Whnx1/SzvHtYsmfIbDHMGfiVbrzT7UE/yDTXPWe5RArI832+9z+spzJUiuxgYlqouM7TYPPIrUGAe6Bx20uCbCzuzsVy7z3hdfXr1zix0RVrmq9anqpebQal0dECDhVZID7yokn9FYAIMnQ92T3cZw5wBWZbgXv1h1vtKfMiyLB1njkXcuKO7T23jlJIx6ru2d3jQACW1+SXnIKVlB6tnXnFOqffURE6O/sDINeAe/jhxVSMuxAl7ECDkiz3gDNex6gzT1YQ2sEUh6D7c/h23K0D0jYFVFA0SOnqkqNiKf0zzkHooEvA6gCvVTExlqN/XQzwbhQcAfEj/Cw4YF800Kg23EI0nrl/ne4eTsGRawq1VgjxeI81ua/XGKmf5xq5BGQztd+ViIbJTkOgDa9myGDb6WSuJrcnUUX60Iv1sSYb/+xvr10+DGrdQbpRY5iTsILUnjFh1VEbiBX/Xv75v3HHPWR+2b9BI6zZ14iE63EIovHU8yLcvnKv0SJyTeQ8y/WTu1es5QaP8XiNIj9t9HaSAkr4Q/c3J2yE4+P673UoNtUn3shpX0hPxWWL7+TRO9ZTu7j5qBbFmPvL5/dCewW2cTsSs/dFDnGtC4eeVYQ/1sbCm7ESF/08wj8DbeWEnkhHZfckZcPeQb4Aot1cJAT2jpcMB06TgIrNh6p+OlRg7v3D6DeoX9QK+5TdUgCGWPgQx0S6S5I7Xx/4JS5QR6pdtYrefIFRK/DrS8LpaXZkVLyboFWDHeGYJo+ilaprVX8X/9cpTfkofSWsorMV+XuC/UTirGQjt+J0rNILQk2K7JFNvOrZJ2J5c8wUt7xpdO1h3xv5V/iZO7UKLQifeZCveol29zMGPcS82AGSyz8ub7fzsqUEzWR+1aJaX44hbUWwG968jFhnHPw7gQiQShGvhsOqT7CjV/6baEl+P0Jx7y+3RnsO11pzQy4OnymAC0hUB81WbWBJCSbwUXKMLYwYZcGhzV8tNMdtZeJjQ5XdfEnBFyRiPnAOxTT8jTAEmAXeDDuK8rWCu90n8epABt7Zw3bhl+zF0NyyCA6Kb7PRK3SB2Luankih83zwNSDKwJUuhsusRqu8Or/csFUmc116tub3QV47/8HKtE0m//eC7MtAaV/gVA4X1FQ/j+9+QuwzWrw+KAiPH74tPPXpqjM3fQRIEtllBuUnHRKC0Xe2pp+EmZIPMxbXe2S3a/OiI6Xft01Xvd1suteZsyyxdPmJxNGvDFdQgAjFn2mRTuh7f+3xvm72gAjLl9xB2gNphJxc7XZDRTnih92ThDb5NC5d2e5fk2c23AhlKS1KHYubcCYyUWzdhUsm9N/7T+L1x6Z/w63WpE6amRnGhLxu+d/biZGrH2yhXZrP9yLmL6JdQzfs+qpILhfBb0XWYsaFGiHl0krsh85ElSosh37boxuNACIv0ItZmJaplZsegbsjaTCV74DtANa4hfXcwOAPB+YaWmd7vWrs9NY/GiHHzvAkmXZTVFSs3SpljCygyLqMt6D1MQJ3CQrk+m1NssOn0PNnyu+ICip/UKT0xB8QgoDmrUzWsTmML1PH+tk6DqNFruAcC9IRLy6FwxZpmcKmR2DkdCNb4BFRt3twi3/D5Zu/IBJCrF5AdYR5l9a20UdR0SRLIvlwd0rh7HwNKIz1npxpU/m5ySuvPMv4E0AfrTUT6CDAIuY1t3CHBKOllB130qZLjaYNUAGqOap8ip5tiSmFDunfbA584KYmqbgUH3WdBKhXafIrwKGAy9kTd3iPmEXmm/IiWAAAA=';


  const THEME_PRESETS = {
    'purple-dragon': {
      name: 'Purple Dragon',
      accent: '#A855F7',
      accent2: '#6D28D9',
      bg: '#110D17',
      header: '#18111F',
      surface: '#21172A',
      surface2: '#2B1D38',
      text: '#FAF7FF',
      muted: '#B7A8C2',
      border: '#B96CFF'
    },
    'discord': {
      name: 'Discord',
      accent: '#5865F2',
      accent2: '#4752C4',
      bg: '#111214',
      header: '#16171A',
      surface: '#1C1D20',
      surface2: '#25262B',
      text: '#F2F3F5',
      muted: '#A7ABB2',
      border: '#7C84F7'
    },
    'midnight': {
      name: 'Midnight',
      accent: '#7C8CFF',
      accent2: '#4454C7',
      bg: '#07090D',
      header: '#0D1016',
      surface: '#141822',
      surface2: '#1B2130',
      text: '#F5F7FF',
      muted: '#9CA6BA',
      border: '#7181F0'
    },
    'amoled': {
      name: 'AMOLED',
      accent: '#8B5CF6',
      accent2: '#5B21B6',
      bg: '#000000',
      header: '#030303',
      surface: '#080808',
      surface2: '#111111',
      text: '#FFFFFF',
      muted: '#A3A3AA',
      border: '#8B5CF6'
    },
    'ocean': {
      name: 'Ocean',
      accent: '#22D3EE',
      accent2: '#0284C7',
      bg: '#071319',
      header: '#0A1A22',
      surface: '#10242D',
      surface2: '#16313D',
      text: '#ECFEFF',
      muted: '#9BC2CB',
      border: '#22D3EE'
    },
    'emerald': {
      name: 'Emerald',
      accent: '#22C55E',
      accent2: '#15803D',
      bg: '#07120B',
      header: '#0B1A10',
      surface: '#10261A',
      surface2: '#173322',
      text: '#F0FDF4',
      muted: '#9EC2AA',
      border: '#22C55E'
    },
    'ruby': {
      name: 'Ruby',
      accent: '#EF4444',
      accent2: '#B91C1C',
      bg: '#160909',
      header: '#1E0D0D',
      surface: '#2A1212',
      surface2: '#381818',
      text: '#FFF7F7',
      muted: '#C7A6A6',
      border: '#EF4444'
    },
    'gold': {
      name: 'Gold',
      accent: '#F59E0B',
      accent2: '#B45309',
      bg: '#151006',
      header: '#1D1608',
      surface: '#2A210D',
      surface2: '#392D12',
      text: '#FFFBEB',
      muted: '#CBB98B',
      border: '#F59E0B'
    },
    'slate': {
      name: 'Slate',
      accent: '#94A3B8',
      accent2: '#64748B',
      bg: '#0B0E12',
      header: '#11151B',
      surface: '#1A2029',
      surface2: '#232B36',
      text: '#F8FAFC',
      muted: '#A7B0BD',
      border: '#94A3B8'
    }
  };

  const defaults = {
    enabled: true,
    performancePlus: true,
    reducedMotion: true,
    disableBlur: true,
    lighterShadows: true,
    compactEffects: true,
    imageRendering: false,
    fpsMeter: false,

    // v0.2.3 — clean Theme Studio state
    uiTheme: 'purple-dragon',
    themeDiscord: false,
    compactPanel: false,
    panelWidth: 360,
    panelOpacity: 96,
    launcherSize: 54,
    launcherGlow: true,
    fpsPosition: 'top-right'
  };

  let settings = loadSettings();
  let fpsHandle = 0;
  let fpsPrevFrame = 0;
  let fpsLastPublish = 0;
  let fpsSamples = [];
  let fpsValue = 0;
  let fpsPeak = 0;
  let fpsBadge = null;
  let panel = null;
  let launcher = null;
  let statsTimer = 0;
  let navData = loadNavigationData();
  let lastServerWorkspaceGuildId = '';
  let serverWorkspaceApplying = false;
  let routeTimer = 0;
  let routeListenersInstalled = false;
  let lastTrackedPath = '';
  let messageData = loadMessageData();
  let selectedMessage = null;
  let selectedMessageElement = null;
  let messagePickHoverElement = null;
  let messagePickMode = false;
  let messagePickerInstalled = false;
  let messageCompareA = null;
  let messageCompareB = null;
  let mediaData = loadMediaData();
  let mediaInspectorItem = null;
  let focusData = loadFocusData();
  let focusActivityScanQueued = false;
  let focusActivityLastScanAt = 0;
  let focusTickerHandle = 0;
  let nitroCosmetic = loadNitroCosmeticData();
  let notificationData = loadNotificationData();
  let lastRawDocumentTitle = document.title;
  let notificationTickerHandle = 0;
  const notificationMutedMedia = new Set();
  const notificationPreviousMuteState = new WeakMap();
  let privacyData = loadPrivacyData();
  let privacyFetchInstalled = false;
  let privacyBeaconInstalled = false;
  let privacyOriginalFetch = null;
  let privacyOriginalBeacon = null;
  let performance2 = loadPerformance2Data();
  let perf2TickerHandle = 0;
  let perf2LongTaskObserver = null;
  let perf2LongTaskCount = 0;
  let perf2LongTaskTime = 0;
  let perf2MutationCount = 0;
  let perf2LastMutationCount = 0;
  let perf2MutationRate = 0;
  let perf2LastMutationSampleAt = performance.now();
  let perf2LastMemoryMB = 0;
  let perf2CachedDomNodes = 0;
  let perf2LastDomRefreshAt = 0;
  let perf2DomDirty = true;
  let perf2LastLongTaskCount = 0;
  let perf2LastLongTaskSampleAt = performance.now();
  let perf2LongTaskRate = 0;
  let perf2PressureScore = 0;
  let perf2HighPressureSamples = 0;
  let perf2LowPressureSamples = 0;
  let perf2HintStateDirty = false;
  const stableBootStartedAt = performance.now();
  let stableBootCompletedAt = 0;
  let stableRelease = loadStableReleaseData();
  let stableLastHealth = null;
  let workspaceData = loadWorkspaceData();
  let smartSearchData = loadSmartSearchData();
  let smartSearchCurrentFilter = 'all';
  let smartSearchLastResults = [];
  let smartSearchInputRef = null;
  let dashboardActiveTab = String(readStoredValue(DASHBOARD_TAB_KEY, 'core') || 'core');
  let dashboardTabsElement = null;
  let uiBuilt = false;
  let bootStarted = false;
  const runtimeIssues = [];

  function powerToolsActive() {
    return !!settings?.enabled;
  }

  function stableSafeModeActive() {
    return powerToolsActive() && !!stableRelease?.safeMode;
  }

  function effectiveFocusMode() {
    return powerToolsActive()
      && !stableSafeModeActive()
      && !!focusData?.focusMode;
  }

  function effectiveNotificationControl() {
    return powerToolsActive() && !!notificationData?.enabled;
  }

  function effectivePrivacyControl() {
    return powerToolsActive() && !!privacyData?.enabled;
  }

  function effectivePerformance2() {
    return powerToolsActive() && !!performance2?.enabled;
  }

  function effectiveNitroPreview() {
    return powerToolsActive() && !!nitroCosmetic?.enabled;
  }

  function recordRuntimeIssue(area, error) {
    const message = error instanceof Error
      ? `${error.name}: ${error.message}`
      : String(error || 'Unknown error');

    runtimeIssues.unshift({
      area: String(area || 'Unknown'),
      message: message.slice(0, 500),
      at: Date.now()
    });

    if (runtimeIssues.length > 20) runtimeIssues.length = 20;

    try {
      console.warn(`[Discord PowerTools] ${area}`, error);
    } catch {}
  }

  function safeRender(area, renderer) {
    if (typeof renderer !== 'function') return false;

    try {
      renderer();
      return true;
    } catch (error) {
      recordRuntimeIssue(area, error);
      return false;
    }
  }

  function readStoredValue(key, fallback = null) {
    // Recover a fallback write even if the manager still contains an older value.
    try {
      if (localStorage.getItem(`${key}:fallbackPending`) === '1') {
        const raw = localStorage.getItem(key);
        if (raw != null) return JSON.parse(raw);
      }
    } catch {}
    // Prefer userscript-manager storage so Discord reloads/SPA changes cannot reset PowerTools.
    try {
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(key, undefined);
        if (value !== undefined) return value;
      }
    } catch {}

    // Migration/fallback for v0.1.0 and managers where GM storage is unavailable.
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch {}

    return fallback;
  }

  function writeStoredValue(key, value) {
    // Keep private notes and saved messages in manager storage when available.
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(key, value);
        try {
          if (localStorage.getItem(`${key}:fallbackPending`) === '1') {
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}:fallbackPending`);
          }
        } catch {}
        return true;
      }
    } catch (error) {
      console.warn('[Discord PowerTools] Manager storage failed', error);
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(`${key}:fallbackPending`, '1');
      return true;
    } catch (error) {
      console.warn('[Discord PowerTools] Settings could not be saved', error);
      if (document.body) toast('Storage full or unavailable. Your changes may not survive a reload.');
      return false;
    }
  }

  function normalizeNavigationData(value) {
    const data = value && typeof value === 'object' ? value : {};

    const rawWorkspaces =
      data.serverWorkspaces && typeof data.serverWorkspaces === 'object'
        ? data.serverWorkspaces
        : {};

    const serverWorkspaces = {};

    for (const [guildId, raw] of Object.entries(rawWorkspaces)) {
      if (!/^\d+$/.test(String(guildId || ''))) continue;

      const record = raw && typeof raw === 'object' ? raw : {};
      const quickRaw =
        record.quickChannels && typeof record.quickChannels === 'object'
          ? record.quickChannels
          : {};

      const quickChannels = {};

      for (const [key, channel] of Object.entries(quickRaw)) {
        if (!channel || typeof channel !== 'object' || !channel.path) continue;
        quickChannels[key] = {
          ...channel,
          key: channel.key || key
        };
      }

      serverWorkspaces[guildId] = {
        guildId,
        serverName: String(record.serverName || '').slice(0, 120),
        note: String(record.note || '').slice(0, 4000),
        autoApply: !!record.autoApply,
        snapshot:
          record.snapshot && typeof record.snapshot === 'object'
            ? record.snapshot
            : null,
        sourceWorkspaceId: String(record.sourceWorkspaceId || ''),
        quickChannels,
        startChannel:
          record.startChannel && typeof record.startChannel === 'object'
            ? record.startChannel
            : null,
        createdAt: Math.max(0, Number(record.createdAt || Date.now())),
        updatedAt: Math.max(0, Number(record.updatedAt || 0)),
        lastAppliedAt: Math.max(0, Number(record.lastAppliedAt || 0))
      };
    }

    return {
      version: 2,
      favorites: data.favorites && typeof data.favorites === 'object'
        ? data.favorites
        : {},
      serverFavorites: data.serverFavorites && typeof data.serverFavorites === 'object'
        ? data.serverFavorites
        : {},
      notes: data.notes && typeof data.notes === 'object'
        ? data.notes
        : {},
      recent: Array.isArray(data.recent)
        ? data.recent.slice(0, 20)
        : [],
      serverWorkspaces
    };
  }

  function loadNavigationData() {
    try {
      const stored = readStoredValue(NAV_DATA_KEY, null);

      return normalizeNavigationData(stored);
    } catch {
      return normalizeNavigationData(null);
    }
  }

  function saveNavigationData() {
    return writeStoredValue(NAV_DATA_KEY, {
          version: 2,
          favorites: { ...navData.favorites },
          serverFavorites: { ...navData.serverFavorites },
          notes: { ...navData.notes },
          recent: [...navData.recent].slice(0, 20),
          serverWorkspaces: { ...navData.serverWorkspaces }
        });
  }

  function parseDiscordRoute(pathname = location.pathname) {
    const parts = String(pathname || '')
      .split('/')
      .filter(Boolean);

    if (parts[0] !== 'channels') {
      return {
        kind: 'other',
        guildId: null,
        channelId: null,
        path: pathname
      };
    }

    const guildId = parts[1] || null;
    const channelId = parts[2] || null;
    const isDM = guildId === '@me';
    const isGuild = !!guildId && /^\d+$/.test(guildId);
    const hasChannel = !!channelId && /^\d+$/.test(channelId);

    return {
      kind: isDM ? 'dm' : (isGuild ? 'guild' : 'other'),
      guildId,
      channelId: hasChannel ? channelId : null,
      isDM,
      isGuild,
      path: hasChannel
        ? `/channels/${guildId}/${channelId}`
        : (guildId ? `/channels/${guildId}` : '/channels/@me')
    };
  }

  function cleanLabel(value, fallback = '') {
    const text = String(value || '')
      .replace(/\s+/g, ' ')
      .replace(/^[#\s]+/, '')
      .trim();

    return text || fallback;
  }

  function serverWorkspaceForGuild(guildId) {
    if (!guildId || !/^\d+$/.test(String(guildId))) return null;
    return navData.serverWorkspaces?.[guildId] || null;
  }

  function currentServerWorkspace() {
    const context = parseDiscordRoute();
    return context.isGuild
      ? serverWorkspaceForGuild(context.guildId)
      : null;
  }

  function ensureServerWorkspace(context = parseDiscordRoute()) {
    if (!context.isGuild || !context.guildId) return null;

    if (!navData.serverWorkspaces) {
      navData.serverWorkspaces = {};
    }

    let record = navData.serverWorkspaces[context.guildId];

    if (!record) {
      record = {
        guildId: context.guildId,
        serverName: currentServerName(context),
        note: '',
        autoApply: false,
        snapshot: null,
        sourceWorkspaceId: '',
        quickChannels: {},
        startChannel: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastAppliedAt: 0
      };

      navData.serverWorkspaces[context.guildId] = record;
    } else {
      record.serverName = currentServerName(context) || record.serverName;
      record.quickChannels =
        record.quickChannels && typeof record.quickChannels === 'object'
          ? record.quickChannels
          : {};
    }

    return record;
  }

  function serverWorkspaceSourceLabel(record) {
    const id = String(record?.sourceWorkspaceId || '');

    if (!id) return 'Manual PowerTools setup';

    if (id.startsWith('builtin:')) {
      const key = id.slice('builtin:'.length);
      return WORKSPACE_PRESETS[key]?.name || 'Built-in Workspace';
    }

    return workspaceData.customProfiles?.[id]?.name || 'Custom Workspace';
  }

  function serverWorkspaceSnapshot() {
    const base = workspaceSnapshot();

    return {
      settings: { ...(base.settings || {}) },
      focus: { ...(base.focus || {}) },
      notification: { ...(base.notification || {}) },
      privacy: { ...(base.privacy || {}) },
      performance2: { ...(base.performance2 || {}) },
      capturedAt: Date.now()
    };
  }

  function captureCurrentServerWorkspace() {
    const context = parseDiscordRoute();
    if (!context.isGuild || !context.guildId) {
      toast('Open a server first');
      return;
    }

    const record = ensureServerWorkspace(context);
    if (!record) return;

    record.serverName = currentServerName(context);
    record.snapshot = serverWorkspaceSnapshot();
    record.sourceWorkspaceId = workspaceData.lastAppliedId || '';
    record.updatedAt = Date.now();

    navData.serverWorkspaces[context.guildId] = record;
    saveNavigationData();
    renderServerChannelStudio();

    toast(`${record.serverName} workspace captured`);
  }

  function applyServerWorkspaceRecord(record, options = {}) {
    if (
      !record?.snapshot
      || typeof record.snapshot !== 'object'
      || serverWorkspaceApplying
    ) {
      if (!record?.snapshot && !options.silent) {
        toast('No saved server workspace yet');
      }
      return false;
    }

    serverWorkspaceApplying = true;

    try {
      const snapshot = record.snapshot;

      settings = normalizeWorkspaceSettings(snapshot.settings);

      // Apply Focus layout/config, but preserve the live timer and productivity stats.
      const focusRuntime = {
        timerMode: focusData.timerMode,
        timerEndAt: focusData.timerEndAt,
        timerRunning: focusData.timerRunning,
        completedFocusSessions: focusData.completedFocusSessions,
        totalFocusMinutes: focusData.totalFocusMinutes
      };

      focusData = normalizeFocusData({
        ...focusData,
        ...(snapshot.focus || {}),
        ...focusRuntime
      });

      // Preserve temporary notification snooze state.
      const currentSnoozeUntil = notificationData.snoozeUntil;

      notificationData = normalizeNotificationData({
        ...notificationData,
        ...(snapshot.notification || {}),
        snoozeUntil: currentSnoozeUntil
      });

      // Preserve diagnostic counters.
      const privacyCounters = {
        blockedCount: privacyData.blockedCount,
        sanitizedCount: privacyData.sanitizedCount
      };

      privacyData = normalizePrivacyData({
        ...privacyData,
        ...(snapshot.privacy || {}),
        ...privacyCounters
      });

      const performanceCounters = {
        imageOptimizedCount: performance2.imageOptimizedCount,
        tuneCount: performance2.tuneCount
      };

      performance2 = normalizePerformance2Data({
        ...performance2,
        ...(snapshot.performance2 || {}),
        ...performanceCounters,
        autoTuneActive: false
      });

      saveSettings();
      saveFocusData();
      saveNotificationData();
      savePrivacyData();
      savePerformance2Data();

      applySettings();
      applyFocusState();
      applyNotificationControlState();
      applyPrivacyState();
      applyPerformance2State();

      record.lastAppliedAt = Date.now();
      record.updatedAt = Math.max(
        Number(record.updatedAt || 0),
        Number(record.lastAppliedAt || 0)
      );

      if (record.guildId && navData.serverWorkspaces?.[record.guildId]) {
        navData.serverWorkspaces[record.guildId] = record;
        saveNavigationData();
      }

      updateUI();

      if (!options.silent) {
        toast(`${record.serverName || 'Server'} workspace applied`);
      }

      return true;
    } finally {
      serverWorkspaceApplying = false;
    }
  }

  function applyCurrentServerWorkspace() {
    const context = parseDiscordRoute();

    if (!context.isGuild || !context.guildId) {
      toast('Open a server first');
      return;
    }

    const record = serverWorkspaceForGuild(context.guildId);

    if (!record?.snapshot) {
      toast('Capture this server workspace first');
      return;
    }

    applyServerWorkspaceRecord(record);
  }

  function toggleCurrentServerWorkspaceAutoApply() {
    const context = parseDiscordRoute();

    if (!context.isGuild || !context.guildId) {
      toast('Open a server first');
      return;
    }

    const record = ensureServerWorkspace(context);

    if (!record.snapshot && !record.autoApply) {
      toast('Capture a server workspace before enabling Auto-Apply');
      return;
    }

    record.autoApply = !record.autoApply;
    record.updatedAt = Date.now();

    navData.serverWorkspaces[context.guildId] = record;
    saveNavigationData();
    renderServerChannelStudio();

    toast(`Server Auto-Apply ${record.autoApply ? 'enabled' : 'disabled'}`);
  }

  function maybeAutoApplyServerWorkspace(context = parseDiscordRoute()) {
    const marker = context.isGuild && context.guildId
      ? context.guildId
      : '@none';

    if (marker === lastServerWorkspaceGuildId) return;
    lastServerWorkspaceGuildId = marker;

    if (!context.isGuild || !context.guildId) return;

    const record = serverWorkspaceForGuild(context.guildId);

    if (!record?.autoApply || !record?.snapshot) return;

    applyServerWorkspaceRecord(record, {
      silent: true,
      auto: true
    });
  }

  function setCurrentServerNote(value) {
    const context = parseDiscordRoute();

    if (!context.isGuild || !context.guildId) {
      toast('Open a server first');
      return;
    }

    const record = ensureServerWorkspace(context);
    const note = String(value || '').trim().slice(0, 4000);

    record.note = note;
    record.updatedAt = Date.now();

    navData.serverWorkspaces[context.guildId] = record;
    saveNavigationData();
    renderServerChannelStudio();

    toast(note ? 'Server note saved' : 'Server note cleared');
  }

  function currentServerPinnedChannels(guildId) {
    if (!guildId) return [];

    return Object.values(navData.favorites || {})
      .filter(item => item?.guildId === guildId && item?.path)
      .sort((a, b) => Number(b.pinnedAt || 0) - Number(a.pinnedAt || 0));
  }

  function toggleCurrentChannelServerShortcut() {
    const context = parseDiscordRoute();
    const current = makeCurrentRecord();

    if (!context.isGuild || !current) {
      toast('Open a server channel first');
      return;
    }

    const record = ensureServerWorkspace(context);
    const quick = record.quickChannels || {};

    if (quick[current.key]) {
      delete quick[current.key];
      toast('Server quick channel removed');
    } else {
      if (Object.keys(quick).length >= 12) {
        toast('Maximum 12 quick channels per server');
        return;
      }

      quick[current.key] = {
        ...current,
        addedAt: Date.now()
      };

      toast('Server quick channel added');
    }

    record.quickChannels = quick;
    record.updatedAt = Date.now();
    navData.serverWorkspaces[context.guildId] = record;

    saveNavigationData();
    renderServerChannelStudio();
  }

  function setCurrentChannelAsServerStart() {
    const context = parseDiscordRoute();
    const current = makeCurrentRecord();

    if (!context.isGuild || !current) {
      toast('Open a server channel first');
      return;
    }

    const record = ensureServerWorkspace(context);

    record.startChannel = {
      ...current,
      setAt: Date.now()
    };
    record.updatedAt = Date.now();

    navData.serverWorkspaces[context.guildId] = record;
    saveNavigationData();
    renderServerChannelStudio();

    toast('Server start channel saved');
  }

  function clearCurrentServerStartChannel() {
    const context = parseDiscordRoute();

    if (!context.isGuild || !context.guildId) {
      toast('Open a server first');
      return;
    }

    const record = serverWorkspaceForGuild(context.guildId);
    if (!record) return;

    record.startChannel = null;
    record.updatedAt = Date.now();

    navData.serverWorkspaces[context.guildId] = record;
    saveNavigationData();
    renderServerChannelStudio();

    toast('Server start channel cleared');
  }

  function openCurrentServerStartChannel() {
    const context = parseDiscordRoute();
    const record = context.isGuild
      ? serverWorkspaceForGuild(context.guildId)
      : null;

    if (!record?.startChannel?.path) {
      toast('No start channel saved for this server');
      return;
    }

    navigateToDiscordPath(record.startChannel.path);
  }

  function removeServerQuickChannel(guildId, key) {
    const record = serverWorkspaceForGuild(guildId);
    if (!record?.quickChannels?.[key]) return;

    delete record.quickChannels[key];

    if (record.startChannel?.key === key) {
      record.startChannel = null;
    }

    record.updatedAt = Date.now();
    navData.serverWorkspaces[guildId] = record;

    saveNavigationData();
    renderServerChannelStudio();

    toast('Server quick channel removed');
  }

  function setServerQuickChannelAsStart(guildId, key) {
    const record = serverWorkspaceForGuild(guildId);
    const channel = record?.quickChannels?.[key];

    if (!record || !channel) return;

    record.startChannel = {
      ...channel,
      setAt: Date.now()
    };
    record.updatedAt = Date.now();

    navData.serverWorkspaces[guildId] = record;
    saveNavigationData();
    renderServerChannelStudio();

    toast('Server start channel updated');
  }

  function deleteServerWorkspace(guildId) {
    if (!guildId || !navData.serverWorkspaces?.[guildId]) return;

    const name =
      navData.serverWorkspaces[guildId]?.serverName
      || `Server ${String(guildId).slice(-6)}`;

    delete navData.serverWorkspaces[guildId];

    if (lastServerWorkspaceGuildId === guildId) {
      lastServerWorkspaceGuildId = '';
    }

    saveNavigationData();
    renderServerChannelStudio();

    toast(`${name} workspace removed`);
  }

  function copyServerWorkspaceBackup(record = currentServerWorkspace()) {
    if (!record) {
      toast('No server workspace available');
      return;
    }

    copyText(JSON.stringify(record, null, 2));
  }

  function serverQuickChannelItem(record, channel) {
    const active = record.startChannel?.key === channel.key;

    const open = button(
      active ? 'Start ✓' : 'Open',
      () => navigateToDiscordPath(channel.path)
    );
    open.classList.add('dpt-nav-mini');

    const start = button(
      active ? 'Clear Start' : 'Set Start',
      () => {
        if (active) {
          if (record.guildId === parseDiscordRoute().guildId) {
            clearCurrentServerStartChannel();
          } else {
            record.startChannel = null;
            record.updatedAt = Date.now();
            navData.serverWorkspaces[record.guildId] = record;
            saveNavigationData();
            renderServerChannelStudio();
          }
        } else {
          setServerQuickChannelAsStart(record.guildId, channel.key);
        }
      }
    );
    start.classList.add('dpt-nav-mini');

    const remove = button(
      'Remove',
      () => removeServerQuickChannel(record.guildId, channel.key),
      true
    );
    remove.classList.add('dpt-nav-mini');

    return el('div', {
      class: `dpt-serverws-quick-item${active ? ' start' : ''}`
    }, [
      el('div', { class: 'dpt-serverws-quick-copy' }, [
        el('div', {
          class: 'dpt-serverws-quick-name',
          text: channel.channelName || `Channel ${String(channel.channelId || '').slice(-6)}`
        }),
        el('div', {
          class: 'dpt-serverws-quick-sub',
          text: channel.channelId || ''
        })
      ]),
      el('div', { class: 'dpt-nav-actions' }, [
        open,
        start,
        remove
      ])
    ]);
  }

  function serverWorkspaceSummary(record) {
    const snapshot = record?.snapshot || {};
    const themeId = snapshot.settings?.uiTheme || '';
    const themeName = THEME_PRESETS[themeId]?.name || themeId || 'Not captured';

    return {
      theme: themeName,
      focus: snapshot.focus?.focusMode ? 'ON' : 'OFF',
      performance: snapshot.performance2?.profile
        ? String(snapshot.performance2.profile).toUpperCase()
        : '—',
      notifications: snapshot.notification?.enabled ? 'ON' : 'OFF',
      privacy: snapshot.privacy?.enabled ? 'ON' : 'OFF'
    };
  }

  function serverWorkspacePanel(context) {
    if (!context.isGuild || !context.guildId) {
      return el('div', { class: 'dpt-serverws-empty' }, [
        el('div', {
          class: 'dpt-serverws-empty-title',
          text: 'Server Workspace+'
        }),
        el('div', {
          class: 'dpt-serverws-empty-sub',
          text: 'Open a Discord server to create a per-server PowerTools workspace.'
        })
      ]);
    }

    const record = serverWorkspaceForGuild(context.guildId);
    const summary = serverWorkspaceSummary(record);
    const pinned = currentServerPinnedChannels(context.guildId);
    const quickChannels = Object.values(record?.quickChannels || {})
      .filter(item => item?.path)
      .sort((a, b) => Number(b.addedAt || 0) - Number(a.addedAt || 0));

    const current = makeCurrentRecord();
    const currentIsQuick = !!(
      current
      && record?.quickChannels?.[current.key]
    );

    const noteInput = el('textarea', {
      class: 'dpt-serverws-note',
      rows: '3',
      maxlength: '4000',
      placeholder: 'Local note for this server…'
    });

    noteInput.value = record?.note || '';

    const hero = el('div', { class: 'dpt-serverws-hero' }, [
      el('div', { class: 'dpt-serverws-hero-copy' }, [
        el('div', {
          class: 'dpt-serverws-kicker',
          text: 'SERVER WORKSPACE+'
        }),
        el('div', {
          class: 'dpt-serverws-title',
          text: currentServerName(context)
        }),
        el('div', {
          class: 'dpt-serverws-sub',
          text: record?.snapshot
            ? `${serverWorkspaceSourceLabel(record)} • saved ${record.updatedAt ? new Date(record.updatedAt).toLocaleString() : 'locally'}`
            : 'No server workspace captured yet.'
        })
      ]),
      el('div', { class: 'dpt-serverws-pills' }, [
        el('span', {
          class: `dpt-serverws-pill${record?.snapshot ? ' active' : ''}`,
          text: record?.snapshot ? 'SAVED' : 'NEW'
        }),
        el('span', {
          class: `dpt-serverws-pill${record?.autoApply ? ' auto' : ''}`,
          text: record?.autoApply ? 'AUTO-APPLY' : 'MANUAL'
        })
      ])
    ]);

    const metrics = el('div', { class: 'dpt-serverws-metrics' }, [
      el('div', {}, [
        el('b', { text: summary.theme }),
        el('span', { text: 'Theme' })
      ]),
      el('div', {}, [
        el('b', { text: summary.focus }),
        el('span', { text: 'Focus' })
      ]),
      el('div', {}, [
        el('b', { text: summary.performance }),
        el('span', { text: 'Perf Profile' })
      ]),
      el('div', {}, [
        el('b', { text: String(pinned.length) }),
        el('span', { text: 'Pinned Channels' })
      ]),
      el('div', {}, [
        el('b', { text: String(quickChannels.length) }),
        el('span', { text: 'Quick Channels' })
      ]),
      el('div', {}, [
        el('b', {
          text: record?.startChannel?.channelName || 'None'
        }),
        el('span', { text: 'Start Channel' })
      ])
    ]);

    const captureWorkspaceButton = button(
      'Capture Current Setup',
      captureCurrentServerWorkspace
    );

    const applyWorkspaceButton = button(
      'Apply Saved Setup',
      applyCurrentServerWorkspace
    );
    applyWorkspaceButton.disabled = !record?.snapshot;

    const autoApplyButton = button(
      record?.autoApply ? 'Auto-Apply: ON' : 'Auto-Apply: OFF',
      toggleCurrentServerWorkspaceAutoApply
    );
    autoApplyButton.disabled = !record?.snapshot;

    const copyWorkspaceButton = button(
      'Copy Server Workspace',
      () => copyServerWorkspaceBackup(record)
    );
    copyWorkspaceButton.disabled = !record;

    const workspaceActions = el('div', {
      class: 'dpt-grid dpt-serverws-actions'
    }, [
      captureWorkspaceButton,
      applyWorkspaceButton,
      autoApplyButton,
      copyWorkspaceButton
    ]);

    const quickChannelButton = button(
      currentIsQuick ? 'Remove Quick Channel' : 'Add Quick Channel',
      toggleCurrentChannelServerShortcut
    );
    quickChannelButton.disabled = !current;

    const setStartButton = button(
      'Set Current as Start',
      setCurrentChannelAsServerStart
    );
    setStartButton.disabled = !current;

    const openStartButton = button(
      'Open Start Channel',
      openCurrentServerStartChannel
    );
    openStartButton.disabled = !record?.startChannel?.path;

    const clearStartButton = button(
      'Clear Start Channel',
      clearCurrentServerStartChannel,
      true
    );
    clearStartButton.disabled = !record?.startChannel;

    const channelActions = el('div', {
      class: 'dpt-grid dpt-serverws-actions'
    }, [
      quickChannelButton,
      setStartButton,
      openStartButton,
      clearStartButton
    ]);

    const noteActions = el('div', {
      class: 'dpt-grid dpt-serverws-note-actions'
    }, [
      button('Save Server Note', () => setCurrentServerNote(noteInput.value)),
      button('Clear Server Note', () => {
        noteInput.value = '';
        setCurrentServerNote('');
      }, true)
    ]);

    const quickList = el('div', { class: 'dpt-serverws-quick-list' },
      quickChannels.length
        ? quickChannels.map(channel => serverQuickChannelItem(record, channel))
        : [
            el('div', {
              class: 'dpt-nav-empty',
              text: 'No server quick channels yet. Add the current channel as a shortcut.'
            })
          ]
    );

    const deleteButton = button(
      'Delete Server Workspace',
      () => deleteServerWorkspace(context.guildId),
      true
    );
    deleteButton.disabled = !record;

    const bottomActions = el('div', {
      class: 'dpt-grid dpt-serverws-bottom-actions'
    }, [
      button('Copy Server ID', copyCurrentServerId),
      button('Copy Channel Link', copyCurrentChannelLink),
      deleteButton
    ]);

    return el('div', { class: 'dpt-serverws-panel' }, [
      hero,
      metrics,
      el('div', {
        class: 'dpt-serverws-explainer',
        text: 'Captured server workspaces can remember local Theme/Interface settings, Focus behavior, Notification/Privacy controls, and Performance+ 2.0 configuration. Focus timer progress and diagnostic counters are preserved.'
      }),
      el('div', {
        class: 'dpt-serverws-group-title',
        text: 'Workspace Configuration'
      }),
      workspaceActions,
      el('div', {
        class: 'dpt-serverws-group-title',
        text: 'Server Note'
      }),
      noteInput,
      noteActions,
      el('div', {
        class: 'dpt-serverws-group-title',
        text: 'Server Shortcuts'
      }),
      channelActions,
      quickList,
      bottomActions
    ]);
  }

  function serverWorkspaceLibraryItem(record) {
    const summary = serverWorkspaceSummary(record);
    const quickCount = Object.keys(record.quickChannels || {}).length;
    const openPath =
      record.startChannel?.path
      || navData.serverFavorites?.[record.guildId]?.path
      || `/channels/${record.guildId}`;

    const open = button(
      'Open',
      () => navigateToDiscordPath(openPath)
    );
    open.classList.add('dpt-nav-mini');

    const apply = button(
      'Apply',
      () => applyServerWorkspaceRecord(record)
    );
    apply.disabled = !record.snapshot;
    apply.classList.add('dpt-nav-mini');

    const copy = button(
      'Copy',
      () => copyServerWorkspaceBackup(record)
    );
    copy.classList.add('dpt-nav-mini');

    const remove = button(
      'Delete',
      () => deleteServerWorkspace(record.guildId),
      true
    );
    remove.classList.add('dpt-nav-mini');

    return el('div', {
      class: 'dpt-serverws-library-item',
      'data-nav-search': [
        record.serverName,
        record.guildId,
        record.note,
        summary.theme,
        summary.performance
      ].join(' ').toLowerCase()
    }, [
      el('div', { class: 'dpt-serverws-library-copy' }, [
        el('div', {
          class: 'dpt-serverws-library-title',
          text: record.serverName || `Server ${String(record.guildId).slice(-6)}`
        }),
        el('div', {
          class: 'dpt-serverws-library-sub',
          text: [
            record.autoApply ? 'Auto-Apply' : 'Manual',
            `${quickCount} quick`,
            summary.theme,
            `Focus ${summary.focus}`,
            `Perf ${summary.performance}`
          ].join(' • ')
        }),
        ...(record.note
          ? [
              el('div', {
                class: 'dpt-serverws-library-note',
                text: record.note.slice(0, 120)
              })
            ]
          : [])
      ]),
      el('div', { class: 'dpt-nav-actions' }, [
        open,
        apply,
        copy,
        remove
      ])
    ]);
  }

  function currentChannelName(context) {
    if (!context?.channelId) return context?.isDM ? 'Direct Messages' : 'Server Home';

    const exactPath = context.path;

    try {
      const candidates = [
        document.querySelector(`a[href="${CSS.escape(exactPath)}"][aria-current="page"]`),
        document.querySelector(`a[href="${CSS.escape(exactPath)}"]`)
      ].filter(Boolean);

      for (const anchor of candidates) {
        const label =
          anchor.getAttribute('aria-label')
          || anchor.getAttribute('title')
          || anchor.textContent;

        const cleaned = cleanLabel(label);
        if (cleaned && cleaned.length <= 90) return cleaned;
      }
    } catch {}

    // Document title is a stable semantic fallback and avoids hashed class names.
    try {
      const title = String(document.title || '')
        .replace(/^\(\d+\)\s*/, '')
        .trim();

      const parts = title.split('|').map(part => part.trim()).filter(Boolean);
      const useful = parts.filter(part => part.toLowerCase() !== 'discord');

      const channelPart = useful.find(part => part.startsWith('#'));
      if (channelPart) return cleanLabel(channelPart);
    } catch {}

    return context.isDM
      ? `DM ${context.channelId.slice(-6)}`
      : `Channel ${context.channelId.slice(-6)}`;
  }

  function currentServerName(context) {
    if (!context?.guildId) return 'Discord';
    if (context.isDM) return 'Direct Messages';

    try {
      const exact = document.querySelector(`a[href="/channels/${CSS.escape(context.guildId)}"]`);
      if (exact) {
        const label =
          exact.getAttribute('aria-label')
          || exact.getAttribute('title')
          || exact.textContent;

        const cleaned = cleanLabel(label);
        if (cleaned && cleaned.length <= 90) return cleaned;
      }
    } catch {}

    try {
      const title = String(document.title || '')
        .replace(/^\(\d+\)\s*/, '')
        .trim();

      const parts = title.split('|').map(part => part.trim()).filter(Boolean);
      const useful = parts.filter(part =>
        part.toLowerCase() !== 'discord'
        && !part.startsWith('#')
      );

      if (useful.length) {
        const candidate = useful[useful.length - 1];
        if (candidate.length <= 90) return candidate;
      }
    } catch {}

    return `Server ${context.guildId.slice(-6)}`;
  }

  function makeCurrentRecord() {
    const context = parseDiscordRoute();

    if (!context.channelId) return null;

    return {
      key: `${context.guildId}:${context.channelId}`,
      guildId: context.guildId,
      channelId: context.channelId,
      path: context.path,
      channelName: currentChannelName(context),
      serverName: currentServerName(context),
      isDM: context.isDM,
      visitedAt: Date.now()
    };
  }

  function channelKey(context = parseDiscordRoute()) {
    return context?.channelId
      ? `${context.guildId}:${context.channelId}`
      : '';
  }

  function isCurrentChannelFavorite() {
    const key = channelKey();
    return !!(key && navData.favorites[key]);
  }

  function isCurrentServerFavorite() {
    const context = parseDiscordRoute();
    return !!(
      context.isGuild
      && context.guildId
      && navData.serverFavorites[context.guildId]
    );
  }

  function toggleCurrentChannelFavorite() {
    const record = makeCurrentRecord();
    if (!record) {
      toast('Open a channel first');
      return;
    }

    if (navData.favorites[record.key]) {
      delete navData.favorites[record.key];
      toast('Channel unpinned');
    } else {
      navData.favorites[record.key] = {
        ...record,
        pinnedAt: Date.now()
      };
      toast('Channel pinned');
    }

    saveNavigationData();
    renderServerChannelStudio();
  }

  function toggleCurrentServerFavorite() {
    const context = parseDiscordRoute();

    if (!context.isGuild || !context.guildId) {
      toast('Open a server first');
      return;
    }

    if (navData.serverFavorites[context.guildId]) {
      delete navData.serverFavorites[context.guildId];
      toast('Server unpinned');
    } else {
      navData.serverFavorites[context.guildId] = {
        guildId: context.guildId,
        serverName: currentServerName(context),
        path: context.channelId
          ? context.path
          : `/channels/${context.guildId}`,
        pinnedAt: Date.now()
      };
      toast('Server pinned');
    }

    saveNavigationData();
    renderServerChannelStudio();
  }

  function setCurrentChannelNote(note) {
    const key = channelKey();

    if (!key) {
      toast('Open a channel first');
      return;
    }

    const value = String(note || '').trim();

    if (value) {
      navData.notes[key] = value.slice(0, 2000);
      toast('Channel note saved');
    } else {
      delete navData.notes[key];
      toast('Channel note cleared');
    }

    saveNavigationData();
    renderServerChannelStudio();
  }

  function getCurrentChannelNote() {
    const key = channelKey();
    return key ? String(navData.notes[key] || '') : '';
  }

  function recordRecentChannel(record) {
    if (!record?.key) return;

    navData.recent = [
      record,
      ...navData.recent.filter(item => item?.key !== record.key)
    ].slice(0, 20);

    if (
      record.guildId
      && /^\d+$/.test(record.guildId)
      && navData.serverFavorites[record.guildId]
    ) {
      navData.serverFavorites[record.guildId] = {
        ...navData.serverFavorites[record.guildId],
        serverName: record.serverName || navData.serverFavorites[record.guildId].serverName,
        path: record.path,
        lastVisited: Date.now()
      };
    }

    saveNavigationData();
  }

  function trackCurrentDiscordRoute(force = false) {
    const currentPath = location.pathname;

    if (!force && currentPath === lastTrackedPath) return;
    lastTrackedPath = currentPath;

    const context = parseDiscordRoute();
    const record = makeCurrentRecord();

    if (record) recordRecentChannel(record);

    maybeAutoApplyServerWorkspace(context);

    if (focusData.focusMode && focusData.hideActivity) {
      scheduleFocusActivityPanelScan(true);
    }

    if (
      panel
      && !panel.hidden
      && dashboardActiveTab === 'servers'
    ) {
      renderServerChannelStudio();
    }
  }

  function startRouteTracker() {
    clearInterval(routeTimer);
    trackCurrentDiscordRoute(true);

    // PushState changes do not emit popstate, so keep a lightweight fallback.
    routeTimer = setInterval(() => {
      if (!document.hidden && location.pathname !== lastTrackedPath) {
        trackCurrentDiscordRoute(false);
      }
    }, 2000);

    if (!routeListenersInstalled) {
      routeListenersInstalled = true;
      window.addEventListener('popstate', () => trackCurrentDiscordRoute(true), { passive: true });
      window.addEventListener('hashchange', () => trackCurrentDiscordRoute(true), { passive: true });
      window.addEventListener('pageshow', () => trackCurrentDiscordRoute(true), { passive: true });
    }
  }

  function navigateToDiscordPath(path) {
    if (!path || !String(path).startsWith('/channels/')) return;

    try {
      const anchors = document.querySelectorAll('a[href^="/channels/"]');

      for (const anchor of anchors) {
        try {
          const url = new URL(anchor.href, location.origin);
          if (url.pathname === path) {
            anchor.click();
            return;
          }
        } catch {}
      }
    } catch {}

    location.assign(`${location.origin}${path}`);
  }

  function copyCurrentChannelId() {
    const context = parseDiscordRoute();
    if (!context.channelId) {
      toast('No channel ID available');
      return;
    }
    copyText(context.channelId);
  }

  function copyCurrentServerId() {
    const context = parseDiscordRoute();
    if (!context.isGuild || !context.guildId) {
      toast('No server ID available');
      return;
    }
    copyText(context.guildId);
  }

  function copyCurrentChannelLink() {
    const context = parseDiscordRoute();
    if (!context.channelId) {
      toast('Open a channel first');
      return;
    }
    copyText(`${location.origin}${context.path}`);
  }

  function previousChannelRecord() {
    const current = channelKey();
    return navData.recent.find(item => item?.key && item.key !== current) || null;
  }

  function clearRecentChannels() {
    navData.recent = [];
    saveNavigationData();
    renderServerChannelStudio();
    toast('Recent channels cleared');
  }

  function removeFavoriteChannel(key) {
    if (!key || !navData.favorites[key]) return;
    delete navData.favorites[key];
    saveNavigationData();
    renderServerChannelStudio();
    toast('Channel unpinned');
  }

  function removeFavoriteServer(guildId) {
    if (!guildId || !navData.serverFavorites[guildId]) return;
    delete navData.serverFavorites[guildId];
    saveNavigationData();
    renderServerChannelStudio();
    toast('Server unpinned');
  }

  function navItem(record, type = 'channel') {
    const isServer = type === 'server';
    const title = isServer
      ? (record.serverName || `Server ${String(record.guildId || '').slice(-6)}`)
      : (record.channelName || `Channel ${String(record.channelId || '').slice(-6)}`);

    const subtitle = isServer
      ? `Server ID: ${record.guildId || '—'}`
      : `${record.serverName || 'Discord'} • ${record.channelId || '—'}`;

    const searchText = `${title} ${subtitle}`.toLowerCase();

    const open = button('Open', () => navigateToDiscordPath(record.path));
    open.classList.add('dpt-nav-mini');

    const remove = button('Remove', () => {
      if (isServer) removeFavoriteServer(record.guildId);
      else removeFavoriteChannel(record.key);
    }, true);
    remove.classList.add('dpt-nav-mini');

    const actions = [open];

    if (type === 'favorite-channel' || type === 'server') {
      actions.push(remove);
    } else {
      const copy = button('Copy', () => copyText(`${location.origin}${record.path}`));
      copy.classList.add('dpt-nav-mini');
      actions.push(copy);
    }

    const item = el('div', {
      class: 'dpt-nav-item',
      'data-nav-search': searchText
    }, [
      el('div', { class: 'dpt-nav-copy' }, [
        el('div', { class: 'dpt-nav-name', text: title }),
        el('div', { class: 'dpt-nav-sub', text: subtitle })
      ]),
      el('div', { class: 'dpt-nav-actions' }, actions)
    ]);

    return item;
  }

  function applyNavigationFilter(container, query) {
    const normalized = String(query || '').trim().toLowerCase();

    container.querySelectorAll('[data-nav-search]').forEach(item => {
      const haystack = item.getAttribute('data-nav-search') || '';
      item.hidden = !!normalized && !haystack.includes(normalized);
    });
  }

  function renderServerChannelStudio() {
    const container = panel?.querySelector('[data-server-channel-studio]');
    if (!container) return;

    const context = parseDiscordRoute();
    const record = makeCurrentRecord();
    const currentNote = getCurrentChannelNote();

    const search = el('input', {
      class: 'dpt-nav-search',
      type: 'search',
      placeholder: 'Filter server workspaces / pinned / recent channels…',
      autocomplete: 'off'
    });

    const contextTitle = record
      ? `${record.serverName} / ${record.channelName}`
      : (context.isGuild ? currentServerName(context) : 'Open a Discord channel');

    const contextSub = record
      ? `${context.isDM ? 'DM' : 'Server'} • Channel ID ${record.channelId}`
      : 'Server & Channel PowerTools activate on /channels/ routes.';

    const channelPinButton = button(
      isCurrentChannelFavorite() ? 'Unpin Channel' : 'Pin Channel',
      toggleCurrentChannelFavorite
    );

    const serverPinButton = button(
      isCurrentServerFavorite() ? 'Unpin Server' : 'Pin Server',
      toggleCurrentServerFavorite
    );
    serverPinButton.disabled = !context.isGuild;

    const quickActions = el('div', { class: 'dpt-grid dpt-nav-quick' }, [
      channelPinButton,
      serverPinButton,
      button('Copy Channel ID', copyCurrentChannelId),
      button('Copy Server ID', copyCurrentServerId),
      button('Copy Channel Link', copyCurrentChannelLink),
      button('Previous Channel', () => {
        const item = previousChannelRecord();
        if (item) navigateToDiscordPath(item.path);
        else toast('No previous channel yet');
      })
    ]);

    const currentCard = el('div', { class: 'dpt-nav-current' }, [
      el('div', { class: 'dpt-nav-current-head' }, [
        el('div', {}, [
          el('div', { class: 'dpt-nav-current-title', text: contextTitle }),
          el('div', { class: 'dpt-nav-current-sub', text: contextSub })
        ]),
        el('span', {
          class: `dpt-nav-status${record ? ' active' : ''}`,
          text: record ? 'LIVE' : 'WAIT'
        })
      ]),
      quickActions
    ]);

    const noteInput = el('textarea', {
      class: 'dpt-nav-note',
      rows: '3',
      maxlength: '2000',
      placeholder: 'Local note for this channel…'
    });
    noteInput.value = currentNote;
    noteInput.disabled = !record;

    const noteActions = el('div', { class: 'dpt-grid dpt-nav-note-actions' }, [
      button('Save Note', () => setCurrentChannelNote(noteInput.value)),
      button('Clear Note', () => {
        noteInput.value = '';
        setCurrentChannelNote('');
      }, true)
    ]);

    const favoriteChannels = Object.values(navData.favorites)
      .filter(item => item?.path)
      .sort((a, b) => Number(b.pinnedAt || 0) - Number(a.pinnedAt || 0));

    const favoriteServers = Object.values(navData.serverFavorites)
      .filter(item => item?.path)
      .sort((a, b) => Number(b.pinnedAt || 0) - Number(a.pinnedAt || 0));

    const recentChannels = navData.recent
      .filter(item => item?.path)
      .slice(0, 12);

    const configuredServerWorkspaces = Object.values(navData.serverWorkspaces || {})
      .filter(item => item?.guildId)
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));

    const favoriteChannelList = el('div', { class: 'dpt-nav-list' },
      favoriteChannels.length
        ? favoriteChannels.map(item => navItem(item, 'favorite-channel'))
        : [el('div', { class: 'dpt-nav-empty', text: 'No pinned channels yet.' })]
    );

    const favoriteServerList = el('div', { class: 'dpt-nav-list' },
      favoriteServers.length
        ? favoriteServers.map(item => navItem(item, 'server'))
        : [el('div', { class: 'dpt-nav-empty', text: 'No pinned servers yet.' })]
    );

    const recentList = el('div', { class: 'dpt-nav-list' },
      recentChannels.length
        ? recentChannels.map(item => navItem(item, 'recent'))
        : [el('div', {
            class: 'dpt-nav-empty',
            text: 'Channel history will appear here as you navigate.'
          })]
    );

    const serverWorkspaceLibrary = el(
      'div',
      { class: 'dpt-serverws-library' },
      configuredServerWorkspaces.length
        ? configuredServerWorkspaces.map(serverWorkspaceLibraryItem)
        : [
            el('div', {
              class: 'dpt-nav-empty',
              text: 'No configured server workspaces yet.'
            })
          ]
    );

    const searchable = el('div', { class: 'dpt-nav-searchable' }, [
      el('div', {
        class: 'dpt-nav-group-title',
        text: `Server Workspaces (${configuredServerWorkspaces.length})`
      }),
      serverWorkspaceLibrary,
      el('div', {
        class: 'dpt-nav-group-title',
        text: `Pinned Channels (${favoriteChannels.length})`
      }),
      favoriteChannelList,
      el('div', {
        class: 'dpt-nav-group-title',
        text: `Pinned Servers (${favoriteServers.length})`
      }),
      favoriteServerList,
      el('div', { class: 'dpt-nav-group-head' }, [
        el('div', {
          class: 'dpt-nav-group-title',
          text: `Recent Channels (${recentChannels.length})`
        }),
        button('Clear', clearRecentChannels, true)
      ]),
      recentList
    ]);

    search.addEventListener('input', () => {
      applyNavigationFilter(searchable, search.value);
    });

    const workspaceActions = el('div', {
      class: 'dpt-grid dpt-nav-workspace-actions'
    }, [
      button(
        'Copy Navigation Backup',
        () => copyText(JSON.stringify(navData, null, 2))
      ),
      button('Refresh Context', () => {
        trackCurrentDiscordRoute(true);
        toast('Server context refreshed');
      })
    ]);

    container.replaceChildren(
      serverWorkspacePanel(context),
      el('div', { class: 'dpt-nav-divider' }),
      currentCard,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', {
        class: 'dpt-nav-group-title',
        text: 'Channel Note'
      }),
      noteInput,
      noteActions,
      el('div', { class: 'dpt-nav-divider' }),
      search,
      searchable,
      workspaceActions
    );
  }

  function normalizeMessageData(value) {
    const data = value && typeof value === 'object' ? value : {};
    const library = data.library && typeof data.library === 'object'
      ? data.library
      : {};

    const validFilters = new Set(['all', 'favorites', 'channel']);
    const validSorts = new Set(['newest', 'oldest', 'author']);

    return {
      version: 2,
      saved: data.saved && typeof data.saved === 'object'
        ? data.saved
        : {},
      library: {
        filter: validFilters.has(library.filter) ? library.filter : 'all',
        sort: validSorts.has(library.sort) ? library.sort : 'newest'
      }
    };
  }

  function loadMessageData() {
    try {
      const stored = readStoredValue(MESSAGE_DATA_KEY, null);

      return normalizeMessageData(stored);
    } catch {
      return normalizeMessageData(null);
    }
  }

  function saveMessageData() {
    return writeStoredValue(MESSAGE_DATA_KEY, {
          version: 2,
          saved: { ...messageData.saved },
          library: { ...messageData.library }
        });
  }

  function uniqueStrings(values) {
    return [...new Set(
      (values || [])
        .map(value => String(value || '').trim())
        .filter(Boolean)
    )];
  }

  function findMessageContainer(target) {
    if (!(target instanceof Element)) return null;

    const direct = target.closest(
      '[data-list-item-id^="chat-messages___"], li[id^="chat-messages-"]'
    );
    if (direct) return direct;

    const content = target.closest('[id^="message-content-"]');
    if (!content) return null;

    return content.closest('[role="listitem"], li') || content.parentElement || content;
  }

  function extractMessageId(container) {
    if (!container) return null;

    const content = container.querySelector?.('[id^="message-content-"]');
    const contentId = content?.id || '';

    let match = contentId.match(/message-content-(\d{15,25})$/);
    if (match) return match[1];

    const listId = container.getAttribute?.('data-list-item-id') || '';
    match = listId.match(/chat-messages___(\d{15,25})$/);
    if (match) return match[1];

    const containerId = container.id || '';
    match = containerId.match(/(\d{15,25})$/);
    if (match) return match[1];

    const anchors = container.querySelectorAll?.('a[href*="/channels/"]') || [];
    for (const anchor of anchors) {
      try {
        const url = new URL(anchor.href, location.origin);
        const parts = url.pathname.split('/').filter(Boolean);

        if (
          parts[0] === 'channels'
          && /^\d+$/.test(parts[3] || '')
        ) {
          return parts[3];
        }
      } catch {}
    }

    return null;
  }

  function extractMessageRoute(container, messageId) {
    const anchors = container?.querySelectorAll?.('a[href*="/channels/"]') || [];

    for (const anchor of anchors) {
      try {
        const url = new URL(anchor.href, location.origin);
        const match = url.pathname.match(
          /^\/channels\/(@me|\d+)\/(\d+)\/(\d+)$/
        );

        if (match) {
          return {
            guildId: match[1],
            channelId: match[2],
            messageId: match[3],
            path: url.pathname
          };
        }
      } catch {}
    }

    const context = parseDiscordRoute();

    if (context.channelId && messageId) {
      return {
        guildId: context.guildId,
        channelId: context.channelId,
        messageId,
        path: `/channels/${context.guildId}/${context.channelId}/${messageId}`
      };
    }

    return {
      guildId: context.guildId,
      channelId: context.channelId,
      messageId,
      path: null
    };
  }

  function extractMessageAuthor(container) {
    if (!container) return 'Unknown author';

    const username = container.querySelector?.('[id^="message-username-"]');
    if (username) {
      const value = cleanLabel(
        username.getAttribute('aria-label')
        || username.getAttribute('title')
        || username.textContent
      );

      if (value) return value;
    }

    const header = container.querySelector?.('h3');
    if (header) {
      const value = cleanLabel(header.textContent);
      if (value && value.length <= 100) return value;
    }

    return 'Unknown author';
  }

  function extractMessageTimestamp(container) {
    const time = container?.querySelector?.('time[datetime]');

    if (!time) {
      return {
        iso: '',
        display: ''
      };
    }

    return {
      iso: time.getAttribute('datetime') || '',
      display: cleanLabel(
        time.getAttribute('aria-label')
        || time.getAttribute('title')
        || time.textContent
      )
    };
  }

  function extractMessageText(container, messageId) {
    if (!container) return '';

    const exact = messageId
      ? container.querySelector?.(`#message-content-${CSS.escape(messageId)}`)
      : null;

    const content = exact || container.querySelector?.('[id^="message-content-"]');

    return String(content?.innerText || content?.textContent || '')
      .replace(/\u200b/g, '')
      .trim();
  }

  function extractMessageLinks(container) {
    if (!container) return [];

    const urls = [];

    container.querySelectorAll?.('a[href]').forEach(anchor => {
      try {
        const url = new URL(anchor.href, location.origin);
        if (!/^https?:$/.test(url.protocol)) return;
        urls.push(url.href);
      } catch {}
    });

    return uniqueStrings(urls);
  }

  function extractAttachmentLinks(container) {
    if (!container) return [];

    const attachments = [];

    container.querySelectorAll?.('a[href]').forEach(anchor => {
      try {
        const url = new URL(anchor.href, location.origin);
        const host = url.hostname.toLowerCase();

        const isDiscordMedia =
          host === 'cdn.discordapp.com'
          || host === 'media.discordapp.net';

        const isAttachmentPath =
          url.pathname.includes('/attachments/')
          || url.pathname.includes('/ephemeral-attachments/');

        if (isDiscordMedia && isAttachmentPath) {
          attachments.push(url.href);
        }
      } catch {}
    });

    return uniqueStrings(attachments);
  }

  function extractCodeBlockRecords(container) {
    if (!container) return [];

    const records = [];

    container.querySelectorAll?.('pre code').forEach(node => {
      const text = String(node.innerText || node.textContent || '').trim();
      if (!text) return;

      const languageClass = [...node.classList]
        .find(name => name.startsWith('language-'));

      const language = languageClass
        ? languageClass.slice('language-'.length)
        : '';

      records.push({
        language,
        text
      });
    });

    return records;
  }

  function extractMessageMentions(container) {
    if (!container) return [];

    const mentions = [];

    container.querySelectorAll?.('[class*="mention"], [aria-label*="mention" i]').forEach(node => {
      const label = cleanLabel(
        node.getAttribute?.('aria-label')
        || node.getAttribute?.('title')
        || node.textContent
      );

      if (label) mentions.push(label);
    });

    return uniqueStrings(mentions).slice(0, 50);
  }

  function extractMessageRecord(container) {
    if (!container) return null;

    const messageId = extractMessageId(container);
    const route = extractMessageRoute(container, messageId);

    if (!route.channelId || !route.messageId) return null;

    const timestamp = extractMessageTimestamp(container);
    const text = extractMessageText(container, route.messageId);
    const links = extractMessageLinks(container);
    const attachments = extractAttachmentLinks(container);
    const codeRecords = extractCodeBlockRecords(container);
    const codeBlocks = codeRecords.map(record => record.text);
    const mentions = extractMessageMentions(container);

    const context = {
      guildId: route.guildId,
      channelId: route.channelId,
      isDM: route.guildId === '@me',
      isGuild: /^\d+$/.test(route.guildId || ''),
      path: `/channels/${route.guildId}/${route.channelId}`
    };

    return {
      key: `${route.guildId}:${route.channelId}:${route.messageId}`,
      guildId: route.guildId,
      channelId: route.channelId,
      messageId: route.messageId,
      path: route.path,
      link: route.path ? `${location.origin}${route.path}` : '',
      author: extractMessageAuthor(container),
      text,
      timestampIso: timestamp.iso,
      timestampDisplay: timestamp.display,
      serverName: currentServerName(context),
      channelName: currentChannelName(context),
      links,
      attachments,
      codeBlocks,
      codeRecords,
      mentions,
      lineCount: text ? text.split(/\r?\n/).length : 0,
      capturedAt: Date.now()
    };
  }

  function clearMessagePickerVisuals() {
    if (messagePickHoverElement) {
      messagePickHoverElement.classList.remove('dpt-message-pick-hover');
      messagePickHoverElement = null;
    }
  }

  function setSelectedMessage(container) {
    const record = extractMessageRecord(container);

    if (!record) {
      toast('Could not read that message');
      return false;
    }

    if (selectedMessageElement && selectedMessageElement !== container) {
      selectedMessageElement.classList.remove('dpt-picked-message');
    }

    selectedMessageElement = container;
    selectedMessageElement.classList.add('dpt-picked-message');
    selectedMessage = record;

    renderMessageUtilities();
    renderMediaAttachmentTools();
    toast('Message selected');
    return true;
  }

  function cancelMessagePickMode(showToast = false) {
    messagePickMode = false;
    clearMessagePickerVisuals();
    document.documentElement.removeAttribute('data-dpt-message-pick');

    if (showToast) toast('Message picker cancelled');
    renderMessageUtilities();
  }

  function startMessagePickMode() {
    messagePickMode = true;
    clearMessagePickerVisuals();
    document.documentElement.setAttribute('data-dpt-message-pick', '1');
    renderMessageUtilities();
    toast('Click a visible Discord message • Esc cancels');
  }

  function installMessagePicker() {
    if (messagePickerInstalled) return;
    messagePickerInstalled = true;

    document.addEventListener('pointerover', event => {
      if (!messagePickMode) return;
      if (panel?.contains(event.target) || launcher?.contains(event.target)) return;

      const container = findMessageContainer(event.target);
      if (!container || container === messagePickHoverElement) return;

      clearMessagePickerVisuals();
      messagePickHoverElement = container;
      messagePickHoverElement.classList.add('dpt-message-pick-hover');
    }, true);

    document.addEventListener('pointerout', event => {
      if (!messagePickMode || !messagePickHoverElement) return;

      const related = event.relatedTarget;
      if (
        related instanceof Node
        && messagePickHoverElement.contains(related)
      ) {
        return;
      }

      clearMessagePickerVisuals();
    }, true);

    document.addEventListener('click', event => {
      if (!messagePickMode) return;
      if (panel?.contains(event.target) || launcher?.contains(event.target)) return;

      const container = findMessageContainer(event.target);
      if (!container) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const picked = setSelectedMessage(container);
      cancelMessagePickMode(false);

      if (!picked) toast('Try clicking directly on the message text');
    }, true);

    document.addEventListener('keydown', event => {
      if (messagePickMode && event.key === 'Escape') {
        event.preventDefault();
        cancelMessagePickMode(true);
      }
    }, true);
  }

  function selectedMessageWordCount() {
    const words = String(selectedMessage?.text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    return words.length;
  }

  function copySelectedMessageText() {
    if (!selectedMessage) return toast('Pick a message first');

    const text = selectedMessage.text
      || selectedMessage.attachments.join('\n')
      || '[Message contains no readable text]';

    copyText(text);
  }

  function copySelectedMessageLink() {
    if (!selectedMessage?.link) return toast('Message link unavailable');
    copyText(selectedMessage.link);
  }

  function copySelectedMessageId() {
    if (!selectedMessage?.messageId) return toast('Message ID unavailable');
    copyText(selectedMessage.messageId);
  }

  function copySelectedMessageTimestamp() {
    if (!selectedMessage) return toast('Pick a message first');

    const value = selectedMessage.timestampIso
      || selectedMessage.timestampDisplay;

    if (!value) return toast('Timestamp unavailable');
    copyText(value);
  }

  function copySelectedMessageQuote() {
    if (!selectedMessage) return toast('Pick a message first');

    const body = String(selectedMessage.text || '[attachment/embed]')
      .split(/\r?\n/)
      .map(line => `> ${line}`)
      .join('\n');

    const header = selectedMessage.author
      ? `**${selectedMessage.author}**`
      : '**Discord message**';

    const footer = selectedMessage.link
      ? `\n${selectedMessage.link}`
      : '';

    copyText(`${header}\n${body}${footer}`);
  }

  function copySelectedMessageLinks() {
    if (!selectedMessage) return toast('Pick a message first');

    const urls = selectedMessage.links || [];
    if (!urls.length) return toast('No links in selected message');

    copyText(urls.join('\n'));
  }

  function copySelectedAttachments() {
    if (!selectedMessage) return toast('Pick a message first');

    const urls = selectedMessage.attachments || [];
    if (!urls.length) return toast('No attachment links found');

    copyText(urls.join('\n'));
  }

  function copySelectedCodeBlocks() {
    if (!selectedMessage) return toast('Pick a message first');

    const blocks = selectedMessage.codeBlocks || [];
    if (!blocks.length) return toast('No code blocks found');

    copyText(blocks.join('\n\n---\n\n'));
  }

  function messageUnixTimestamp(record = selectedMessage) {
    const iso = record?.timestampIso;
    if (!iso) return 0;

    const value = Date.parse(iso);
    return Number.isFinite(value) ? Math.floor(value / 1000) : 0;
  }

  function selectedMessageTimestampFormats(record = selectedMessage) {
    const unix = messageUnixTimestamp(record);

    return {
      iso: record?.timestampIso || '',
      local: unix
        ? new Date(unix * 1000).toLocaleString()
        : (record?.timestampDisplay || ''),
      shortTime: unix ? `<t:${unix}:t>` : '',
      longTime: unix ? `<t:${unix}:T>` : '',
      shortDate: unix ? `<t:${unix}:d>` : '',
      longDate: unix ? `<t:${unix}:D>` : '',
      shortDateTime: unix ? `<t:${unix}:f>` : '',
      longDateTime: unix ? `<t:${unix}:F>` : '',
      relative: unix ? `<t:${unix}:R>` : ''
    };
  }

  function copySelectedTimestampFormat(style) {
    if (!selectedMessage) return toast('Pick a message first');

    const formats = selectedMessageTimestampFormats();
    const value = formats[style];

    if (!value) return toast('Timestamp unavailable');
    copyText(value);
  }

  function copySelectedTimestampPack() {
    if (!selectedMessage) return toast('Pick a message first');

    const formats = selectedMessageTimestampFormats();
    const lines = [
      `ISO: ${formats.iso || 'Unavailable'}`,
      `Local: ${formats.local || 'Unavailable'}`,
      `Discord Short Time: ${formats.shortTime || 'Unavailable'}`,
      `Discord Long Time: ${formats.longTime || 'Unavailable'}`,
      `Discord Short Date: ${formats.shortDate || 'Unavailable'}`,
      `Discord Long Date: ${formats.longDate || 'Unavailable'}`,
      `Discord Short Date/Time: ${formats.shortDateTime || 'Unavailable'}`,
      `Discord Long Date/Time: ${formats.longDateTime || 'Unavailable'}`,
      `Discord Relative: ${formats.relative || 'Unavailable'}`
    ];

    copyText(lines.join('\n'));
  }

  function formatMessageQuote(record, style = 'rich') {
    if (!record) return '';

    const text = String(record.text || '[attachment/embed]');
    const quoted = text
      .split(/\r?\n/)
      .map(line => `> ${line}`)
      .join('\n');

    if (style === 'plain') {
      return quoted;
    }

    if (style === 'compact') {
      const head = record.author || 'Discord message';
      return `${head}: ${text.replace(/\s+/g, ' ').trim()}${record.link ? `\n${record.link}` : ''}`;
    }

    const timestamp = selectedMessageTimestampFormats(record).longDateTime;
    const headerParts = [
      record.author || 'Discord message',
      timestamp
    ].filter(Boolean);

    return [
      `**${headerParts.join(' • ')}**`,
      quoted,
      record.link || ''
    ].filter(Boolean).join('\n');
  }

  function copySelectedQuoteStyle(style) {
    if (!selectedMessage) return toast('Pick a message first');
    copyText(formatMessageQuote(selectedMessage, style));
  }

  function messageLinkRecords(record = selectedMessage) {
    if (!record) return [];

    return (record.links || []).map(url => {
      let host = '';
      let clean = url;

      try {
        const parsed = new URL(url, location.origin);
        host = parsed.hostname;
        clean = typeof sanitizeUrl === 'function'
          ? sanitizeUrl(url, false, true)
          : parsed.href;
      } catch {}

      return {
        url,
        clean,
        host
      };
    });
  }

  function copySelectedCleanLinks() {
    if (!selectedMessage) return toast('Pick a message first');

    const records = messageLinkRecords();
    if (!records.length) return toast('No links in selected message');

    copyText(records.map(record => record.clean || record.url).join('\n'));
  }

  function copySelectedDomains() {
    if (!selectedMessage) return toast('Pick a message first');

    const domains = uniqueStrings(
      messageLinkRecords()
        .map(record => record.host)
        .filter(Boolean)
    );

    if (!domains.length) return toast('No link domains found');
    copyText(domains.join('\n'));
  }

  function selectedCodeRecords(record = selectedMessage) {
    if (!record) return [];

    if (Array.isArray(record.codeRecords) && record.codeRecords.length) {
      return record.codeRecords;
    }

    return (record.codeBlocks || []).map(text => ({
      language: '',
      text
    }));
  }

  function copySelectedCodeFenced() {
    if (!selectedMessage) return toast('Pick a message first');

    const records = selectedCodeRecords();
    if (!records.length) return toast('No code blocks found');

    const output = records.map(record => {
      const language = record.language || '';
      return `\`\`\`${language}\n${record.text}\n\`\`\``;
    }).join('\n\n');

    copyText(output);
  }

  function copySelectedCodeNumbered() {
    if (!selectedMessage) return toast('Pick a message first');

    const records = selectedCodeRecords();
    if (!records.length) return toast('No code blocks found');

    const output = records.map((record, index) => {
      const numbered = String(record.text || '')
        .split(/\r?\n/)
        .map((line, lineIndex) => `${String(lineIndex + 1).padStart(3, ' ')} | ${line}`)
        .join('\n');

      return [
        `Code Block ${index + 1}${record.language ? ` (${record.language})` : ''}`,
        numbered
      ].join('\n');
    }).join('\n\n---\n\n');

    copyText(output);
  }

  function copySelectedMessageJson() {
    if (!selectedMessage) return toast('Pick a message first');

    copyText(JSON.stringify({
      ...selectedMessage,
      selectedAt: new Date().toISOString()
    }, null, 2));
  }

  function cloneMessageForCompare(record) {
    if (!record) return null;

    return JSON.parse(JSON.stringify(record));
  }

  function setMessageCompareSlot(slot) {
    if (!selectedMessage) return toast('Pick a message first');

    if (slot === 'A') {
      messageCompareA = cloneMessageForCompare(selectedMessage);
    } else {
      messageCompareB = cloneMessageForCompare(selectedMessage);
    }

    renderMessageUtilities();
    toast(`Selected message stored in Compare ${slot}`);
  }

  function clearMessageCompare() {
    messageCompareA = null;
    messageCompareB = null;
    renderMessageUtilities();
    toast('Message comparison cleared');
  }

  function messageWordSet(record) {
    return new Set(
      String(record?.text || '')
        .toLowerCase()
        .match(/[\p{L}\p{N}_'-]+/gu)
        || []
    );
  }

  function compareMessageRecords(a, b) {
    if (!a || !b) return null;

    const aWords = messageWordSet(a);
    const bWords = messageWordSet(b);

    const sharedWords = [...aWords].filter(word => bWords.has(word)).length;
    const addedWords = [...bWords].filter(word => !aWords.has(word)).length;
    const removedWords = [...aWords].filter(word => !bWords.has(word)).length;

    const aLines = String(a.text || '').split(/\r?\n/);
    const bLines = String(b.text || '').split(/\r?\n/);
    const maxLines = Math.max(aLines.length, bLines.length);

    let changedLines = 0;
    for (let index = 0; index < maxLines; index++) {
      if ((aLines[index] || '') !== (bLines[index] || '')) {
        changedLines += 1;
      }
    }

    const aLinks = new Set(a.links || []);
    const bLinks = new Set(b.links || []);

    return {
      sameAuthor: a.author === b.author,
      sameChannel: a.channelId === b.channelId,
      charDelta: String(b.text || '').length - String(a.text || '').length,
      lineDelta: bLines.length - aLines.length,
      changedLines,
      sharedWords,
      addedWords,
      removedWords,
      linksAdded: [...bLinks].filter(link => !aLinks.has(link)).length,
      linksRemoved: [...aLinks].filter(link => !bLinks.has(link)).length
    };
  }

  function copyMessageComparison() {
    const comparison = compareMessageRecords(messageCompareA, messageCompareB);

    if (!comparison) return toast('Set Compare A and Compare B first');

    copyText(JSON.stringify({
      compareA: messageCompareA,
      compareB: messageCompareB,
      summary: comparison
    }, null, 2));
  }

  function toggleSavedMessageFavorite(key) {
    const record = messageData.saved[key];
    if (!record) return;

    record.favorite = !record.favorite;
    messageData.saved[key] = record;
    saveMessageData();
    renderMessageUtilities();

    toast(record.favorite ? 'Saved message favorited' : 'Favorite removed');
  }

  function updateMessageLibrarySetting(key, value) {
    messageData.library[key] = value;
    saveMessageData();
    renderMessageUtilities();
  }

  function savedMessageVisibleForFilter(record) {
    const filter = messageData.library.filter;

    if (filter === 'favorites') {
      return !!record.favorite;
    }

    if (filter === 'channel') {
      const context = parseDiscordRoute();
      return !!(
        context.channelId
        && record.channelId === context.channelId
      );
    }

    return true;
  }

  function sortedSavedMessages() {
    const sort = messageData.library.sort;

    const saved = Object.values(messageData.saved)
      .filter(item => item?.key)
      .filter(savedMessageVisibleForFilter);

    saved.sort((a, b) => {
      if (sort === 'oldest') {
        return Number(a.savedAt || 0) - Number(b.savedAt || 0);
      }

      if (sort === 'author') {
        return String(a.author || '').localeCompare(String(b.author || ''));
      }

      return Number(b.savedAt || 0) - Number(a.savedAt || 0);
    });

    return saved;
  }

  function isSelectedMessageSaved() {
    return !!(
      selectedMessage?.key
      && messageData.saved[selectedMessage.key]
    );
  }

  function toggleSaveSelectedMessage() {
    if (!selectedMessage?.key) {
      toast('Pick a message first');
      return;
    }

    if (messageData.saved[selectedMessage.key]) {
      delete messageData.saved[selectedMessage.key];
      saveMessageData();
      renderMessageUtilities();
      toast('Saved message removed');
      return;
    }

    messageData.saved[selectedMessage.key] = {
      ...selectedMessage,
      favorite: false,
      savedAt: Date.now()
    };

    // Keep the local library bounded.
    const all = Object.values(messageData.saved)
      .sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0));

    if (all.length > 100) {
      for (const item of all.slice(100)) {
        if (item?.key) delete messageData.saved[item.key];
      }
    }

    saveMessageData();
    renderMessageUtilities();
    toast('Message saved locally');
  }

  function removeSavedMessage(key) {
    if (!key || !messageData.saved[key]) return;

    delete messageData.saved[key];
    saveMessageData();
    renderMessageUtilities();
    toast('Saved message removed');
  }

  function clearSavedMessages() {
    messageData.saved = {};
    saveMessageData();
    renderMessageUtilities();
    toast('Saved message library cleared');
  }

  function messageUtilityButton(label, handler, disabled = false, danger = false) {
    const control = button(label, handler, danger);
    control.disabled = !!disabled;
    return control;
  }

  function savedMessageItem(record) {
    const excerpt = cleanLabel(record.text, '[attachment/embed]')
      .slice(0, 92);

    const title = record.author && record.author !== 'Unknown author'
      ? record.author
      : 'Saved Message';

    const locationText = [
      record.serverName,
      record.channelName
    ].filter(Boolean).join(' / ');

    const timestamp = record.timestampDisplay
      || record.timestampIso
      || '';

    const searchText = [
      title,
      excerpt,
      locationText,
      timestamp,
      record.messageId,
      record.favorite ? 'favorite starred' : ''
    ].join(' ').toLowerCase();

    const favorite = button(
      record.favorite ? '★' : '☆',
      () => toggleSavedMessageFavorite(record.key),
      false
    );
    favorite.classList.add('dpt-nav-mini', 'dpt-message-favorite');
    favorite.title = record.favorite ? 'Remove favorite' : 'Favorite message';

    const jump = button('Jump', () => {
      if (record.path) navigateToDiscordPath(record.path);
      else toast('Message link unavailable');
    });
    jump.classList.add('dpt-nav-mini');

    const copy = button('Copy', () => {
      copyText(record.text || record.link || '[Saved Discord message]');
    });
    copy.classList.add('dpt-nav-mini');

    const remove = button('Remove', () => removeSavedMessage(record.key), true);
    remove.classList.add('dpt-nav-mini');

    return el('div', {
      class: `dpt-message-saved-item${record.favorite ? ' favorite' : ''}`,
      'data-message-search': searchText
    }, [
      el('div', { class: 'dpt-message-saved-copy' }, [
        el('div', { class: 'dpt-message-saved-title-row' }, [
          el('div', { class: 'dpt-message-saved-author', text: title }),
          ...(record.favorite
            ? [el('span', { class: 'dpt-message-favorite-pill', text: 'FAVORITE' })]
            : [])
        ]),
        el('div', { class: 'dpt-message-saved-excerpt', text: excerpt }),
        el('div', {
          class: 'dpt-message-saved-meta',
          text: [locationText, timestamp].filter(Boolean).join(' • ')
        })
      ]),
      el('div', { class: 'dpt-nav-actions' }, [favorite, jump, copy, remove])
    ]);
  }

  function filterSavedMessages(container, query) {
    const normalized = String(query || '').trim().toLowerCase();

    container.querySelectorAll('[data-message-search]').forEach(item => {
      const haystack = item.getAttribute('data-message-search') || '';
      item.hidden = !!normalized && !haystack.includes(normalized);
    });
  }

  function renderMessageUtilities() {
    const container = panel?.querySelector('[data-message-utilities]');
    if (!container) return;

    const picked = selectedMessage;
    const hasPicked = !!picked;

    const status = el('div', {
      class: `dpt-message2-hero${messagePickMode ? ' picking' : ''}`
    }, [
      el('div', { class: 'dpt-message2-hero-copy' }, [
        el('div', {
          class: 'dpt-message2-kicker',
          text: 'MESSAGE UTILITIES 2.0'
        }),
        el('div', {
          class: 'dpt-message2-title',
          text: messagePickMode
            ? 'Message Picker Active'
            : (hasPicked ? 'Message Selected' : 'Ready to Inspect')
        }),
        el('div', {
          class: 'dpt-message2-sub',
          text: messagePickMode
            ? 'Hover a visible Discord message and click it. Esc cancels.'
            : (hasPicked
                ? `${picked.author} • ${picked.serverName || 'Discord'} / ${picked.channelName || 'Channel'}`
                : 'Pick a visible message to unlock inspector, quote, timestamp, code, comparison, and library tools.')
        })
      ]),
      el('span', {
        class: `dpt-message2-state${hasPicked ? ' active' : ''}`,
        text: messagePickMode ? 'PICKING' : (hasPicked ? 'SELECTED' : 'IDLE')
      })
    ]);

    const pickerButton = button(
      messagePickMode ? 'Cancel Picker' : 'Pick Message',
      () => messagePickMode
        ? cancelMessagePickMode(true)
        : startMessagePickMode(),
      messagePickMode
    );

    const saveButton = messageUtilityButton(
      hasPicked && isSelectedMessageSaved() ? 'Unsave Message' : 'Save Message',
      toggleSaveSelectedMessage,
      !hasPicked
    );

    const primaryActions = el('div', { class: 'dpt-grid dpt-message2-primary-actions' }, [
      pickerButton,
      saveButton,
      messageUtilityButton('Copy Text', copySelectedMessageText, !hasPicked),
      messageUtilityButton('Copy Message JSON', copySelectedMessageJson, !hasPicked)
    ]);

    const inspectorMetrics = hasPicked
      ? el('div', { class: 'dpt-message2-metrics' }, [
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: String((picked.text || '').length) }),
            el('span', { text: 'Characters' })
          ]),
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: String(selectedMessageWordCount()) }),
            el('span', { text: 'Words' })
          ]),
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: String(picked.lineCount || (picked.text ? picked.text.split(/\r?\n/).length : 0)) }),
            el('span', { text: 'Lines' })
          ]),
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: String(picked.links?.length || 0) }),
            el('span', { text: 'Links' })
          ]),
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: String(picked.attachments?.length || 0) }),
            el('span', { text: 'Attachments' })
          ]),
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: String(selectedCodeRecords(picked).length) }),
            el('span', { text: 'Code Blocks' })
          ]),
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: String(picked.mentions?.length || 0) }),
            el('span', { text: 'Mentions' })
          ]),
          el('div', { class: 'dpt-message2-metric' }, [
            el('b', { text: picked.guildId === '@me' ? 'DM' : 'SERVER' }),
            el('span', { text: 'Context' })
          ])
        ])
      : null;

    const preview = hasPicked
      ? el('div', { class: 'dpt-message2-preview' }, [
          el('div', { class: 'dpt-message2-preview-head' }, [
            el('div', {}, [
              el('strong', { text: picked.author }),
              el('div', {
                class: 'dpt-message2-preview-location',
                text: [picked.serverName, picked.channelName].filter(Boolean).join(' / ')
              })
            ]),
            el('span', {
              text: picked.timestampDisplay || picked.timestampIso || 'No timestamp'
            })
          ]),
          el('div', {
            class: 'dpt-message2-preview-text',
            text: picked.text || '[Message contains attachment/embed content]'
          }),
          el('div', { class: 'dpt-message2-id-row' }, [
            el('span', { text: `Message ${picked.messageId}` }),
            el('span', { text: `Channel ${picked.channelId}` })
          ])
        ])
      : null;

    const quickCopy = el('div', { class: 'dpt-grid dpt-message2-tool-grid' }, [
      messageUtilityButton('Copy Link', copySelectedMessageLink, !hasPicked || !picked?.link),
      messageUtilityButton('Copy Message ID', copySelectedMessageId, !hasPicked),
      messageUtilityButton('Copy Timestamp', copySelectedMessageTimestamp, !hasPicked),
      messageUtilityButton('Copy URLs', copySelectedMessageLinks, !hasPicked || !(picked?.links?.length)),
      messageUtilityButton('Copy Clean URLs', copySelectedCleanLinks, !hasPicked || !(picked?.links?.length)),
      messageUtilityButton('Copy Domains', copySelectedDomains, !hasPicked || !(picked?.links?.length)),
      messageUtilityButton('Copy Attachments', copySelectedAttachments, !hasPicked || !(picked?.attachments?.length)),
      messageUtilityButton('Copy Code Blocks', copySelectedCodeBlocks, !hasPicked || !(picked?.codeBlocks?.length))
    ]);

    const quoteTools = el('div', { class: 'dpt-grid dpt-message2-tool-grid' }, [
      messageUtilityButton('Rich Quote', () => copySelectedQuoteStyle('rich'), !hasPicked),
      messageUtilityButton('Compact Quote', () => copySelectedQuoteStyle('compact'), !hasPicked),
      messageUtilityButton('Plain Blockquote', () => copySelectedQuoteStyle('plain'), !hasPicked),
      messageUtilityButton('Legacy Quote', copySelectedMessageQuote, !hasPicked)
    ]);

    const timestampTools = el('div', { class: 'dpt-grid dpt-message2-tool-grid' }, [
      messageUtilityButton('Discord Full', () => copySelectedTimestampFormat('longDateTime'), !hasPicked),
      messageUtilityButton('Discord Relative', () => copySelectedTimestampFormat('relative'), !hasPicked),
      messageUtilityButton('Discord Time', () => copySelectedTimestampFormat('shortTime'), !hasPicked),
      messageUtilityButton('Copy All Formats', copySelectedTimestampPack, !hasPicked)
    ]);

    const codeRecords = hasPicked ? selectedCodeRecords(picked) : [];
    const codeTools = el('div', { class: 'dpt-grid dpt-message2-tool-grid' }, [
      messageUtilityButton('Copy Raw Code', copySelectedCodeBlocks, !codeRecords.length),
      messageUtilityButton('Copy Fenced Code', copySelectedCodeFenced, !codeRecords.length),
      messageUtilityButton('Copy Numbered Code', copySelectedCodeNumbered, !codeRecords.length),
      messageUtilityButton(
        'Copy Languages',
        () => {
          const languages = uniqueStrings(codeRecords.map(record => record.language).filter(Boolean));
          if (!languages.length) return toast('No code languages detected');
          copyText(languages.join('\n'));
        },
        !codeRecords.length
      )
    ]);

    const linkRecords = hasPicked ? messageLinkRecords(picked) : [];
    const linkList = el('div', { class: 'dpt-message2-link-list' },
      linkRecords.length
        ? linkRecords.map((record, index) => {
            const open = button('Open', () => privateOpenUrl(record.clean || record.url));
            open.classList.add('dpt-nav-mini');

            const copy = button('Copy Clean', () => copyText(record.clean || record.url));
            copy.classList.add('dpt-nav-mini');

            return el('div', { class: 'dpt-message2-link-item' }, [
              el('div', { class: 'dpt-message2-link-copy' }, [
                el('div', {
                  class: 'dpt-message2-link-host',
                  text: record.host || `Link ${index + 1}`
                }),
                el('div', {
                  class: 'dpt-message2-link-url',
                  text: record.clean || record.url
                })
              ]),
              el('div', { class: 'dpt-nav-actions' }, [open, copy])
            ]);
          })
        : [el('div', {
            class: 'dpt-nav-empty',
            text: hasPicked ? 'No links in selected message.' : 'Pick a message to inspect links.'
          })]
    );

    const comparison = compareMessageRecords(messageCompareA, messageCompareB);

    const compareStatus = el('div', { class: 'dpt-message2-compare-slots' }, [
      el('div', { class: `dpt-message2-compare-slot${messageCompareA ? ' filled' : ''}` }, [
        el('span', { text: 'A' }),
        el('div', {}, [
          el('strong', { text: messageCompareA?.author || 'Not set' }),
          el('small', {
            text: messageCompareA
              ? cleanLabel(messageCompareA.text, '[attachment/embed]').slice(0, 52)
              : 'Select a message and choose Set Compare A'
          })
        ])
      ]),
      el('div', { class: `dpt-message2-compare-slot${messageCompareB ? ' filled' : ''}` }, [
        el('span', { text: 'B' }),
        el('div', {}, [
          el('strong', { text: messageCompareB?.author || 'Not set' }),
          el('small', {
            text: messageCompareB
              ? cleanLabel(messageCompareB.text, '[attachment/embed]').slice(0, 52)
              : 'Select a message and choose Set Compare B'
          })
        ])
      ])
    ]);

    const compareActions = el('div', { class: 'dpt-grid dpt-message2-tool-grid' }, [
      messageUtilityButton('Set Compare A', () => setMessageCompareSlot('A'), !hasPicked),
      messageUtilityButton('Set Compare B', () => setMessageCompareSlot('B'), !hasPicked),
      messageUtilityButton('Copy Comparison', copyMessageComparison, !comparison),
      button('Clear Compare', clearMessageCompare, true)
    ]);

    const compareSummary = comparison
      ? el('div', { class: 'dpt-message2-compare-summary' }, [
          el('div', {}, [
            el('b', { text: comparison.sameAuthor ? 'Same' : 'Different' }),
            el('span', { text: 'Author' })
          ]),
          el('div', {}, [
            el('b', { text: comparison.sameChannel ? 'Same' : 'Different' }),
            el('span', { text: 'Channel' })
          ]),
          el('div', {}, [
            el('b', { text: `${comparison.charDelta >= 0 ? '+' : ''}${comparison.charDelta}` }),
            el('span', { text: 'Characters' })
          ]),
          el('div', {}, [
            el('b', { text: String(comparison.changedLines) }),
            el('span', { text: 'Changed Lines' })
          ]),
          el('div', {}, [
            el('b', { text: String(comparison.addedWords) }),
            el('span', { text: 'Words Added' })
          ]),
          el('div', {}, [
            el('b', { text: String(comparison.removedWords) }),
            el('span', { text: 'Words Removed' })
          ])
        ])
      : null;

    const saved = sortedSavedMessages();

    const search = el('input', {
      class: 'dpt-nav-search',
      type: 'search',
      placeholder: 'Search saved messages…',
      autocomplete: 'off'
    });

    const filterSelect = el('select', { class: 'dpt-select dpt-message2-library-select' }, [
      el('option', { value: 'all', text: 'All Messages' }),
      el('option', { value: 'favorites', text: 'Favorites' }),
      el('option', { value: 'channel', text: 'Current Channel' })
    ]);
    filterSelect.value = messageData.library.filter;

    filterSelect.addEventListener('change', () => {
      updateMessageLibrarySetting('filter', filterSelect.value);
    });

    const sortSelect = el('select', { class: 'dpt-select dpt-message2-library-select' }, [
      el('option', { value: 'newest', text: 'Newest First' }),
      el('option', { value: 'oldest', text: 'Oldest First' }),
      el('option', { value: 'author', text: 'Author A–Z' })
    ]);
    sortSelect.value = messageData.library.sort;

    sortSelect.addEventListener('change', () => {
      updateMessageLibrarySetting('sort', sortSelect.value);
    });

    const savedList = el('div', { class: 'dpt-message-saved-list' },
      saved.length
        ? saved.map(savedMessageItem)
        : [el('div', {
            class: 'dpt-nav-empty',
            text: messageData.library.filter === 'favorites'
              ? 'No favorite saved messages.'
              : (messageData.library.filter === 'channel'
                  ? 'No saved messages for the current channel.'
                  : 'No saved messages yet.')
          })]
    );

    search.addEventListener('input', () => {
      filterSavedMessages(savedList, search.value);
    });

    const allSavedCount = Object.values(messageData.saved)
      .filter(item => item?.key).length;

    const favoriteCount = Object.values(messageData.saved)
      .filter(item => item?.key && item.favorite).length;

    const libraryHeader = el('div', { class: 'dpt-message2-library-head' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-nav-group-title',
          text: `Saved Message Library (${allSavedCount})`
        }),
        el('div', {
          class: 'dpt-message2-library-sub',
          text: `${favoriteCount} favorites • showing ${saved.length}`
        })
      ]),
      button('Clear All', clearSavedMessages, true)
    ]);

    const libraryControls = el('div', { class: 'dpt-message2-library-controls' }, [
      search,
      filterSelect,
      sortSelect
    ]);

    const libraryActions = el('div', { class: 'dpt-grid dpt-message-library-actions' }, [
      button('Copy Library Backup', () => copyText(JSON.stringify(messageData, null, 2))),
      button('Refresh Selection', () => {
        if (!selectedMessageElement?.isConnected) {
          toast('Selected message is no longer visible');
          return;
        }

        setSelectedMessage(selectedMessageElement);
      })
    ]);

    const sections = [
      status,
      primaryActions
    ];

    if (inspectorMetrics) sections.push(inspectorMetrics);
    if (preview) sections.push(preview);

    sections.push(
      el('div', { class: 'dpt-message2-section-label', text: 'Quick Copy' }),
      quickCopy,
      el('div', { class: 'dpt-message2-section-label', text: 'Quote Studio' }),
      quoteTools,
      el('div', { class: 'dpt-message2-section-label', text: 'Timestamp Studio' }),
      timestampTools,
      el('div', { class: 'dpt-message2-section-label', text: 'Code Tools' }),
      codeTools,
      el('div', { class: 'dpt-message2-section-label', text: 'Link Inspector' }),
      linkList,
      el('div', { class: 'dpt-message2-section-label', text: 'Message Compare' }),
      compareStatus,
      compareActions
    );

    if (compareSummary) sections.push(compareSummary);

    sections.push(
      el('div', { class: 'dpt-message2-section-label', text: 'Saved Message Library' }),
      libraryHeader,
      libraryControls,
      savedList,
      libraryActions
    );

    container.replaceChildren(...sections);
  }

  function normalizeMediaData(value) {
    const data = value && typeof value === 'object' ? value : {};
    const library = data.library && typeof data.library === 'object'
      ? data.library
      : {};

    const validCurrentFilters = new Set([
      'all', 'image', 'video', 'audio', 'file'
    ]);

    const validSavedFilters = new Set([
      'all', 'favorites', 'image', 'video', 'audio', 'file'
    ]);

    const validSorts = new Set([
      'newest', 'oldest', 'name', 'type', 'resolution', 'duration'
    ]);

    return {
      version: 2,
      saved: data.saved && typeof data.saved === 'object'
        ? data.saved
        : {},
      library: {
        currentFilter: validCurrentFilters.has(library.currentFilter)
          ? library.currentFilter
          : 'all',
        savedFilter: validSavedFilters.has(library.savedFilter)
          ? library.savedFilter
          : 'all',
        savedSort: validSorts.has(library.savedSort)
          ? library.savedSort
          : 'newest'
      }
    };
  }

  function loadMediaData() {
    try {
      const stored = readStoredValue(MEDIA_DATA_KEY, null);

      return normalizeMediaData(stored);
    } catch {
      return normalizeMediaData(null);
    }
  }

  function saveMediaData() {
    return writeStoredValue(MEDIA_DATA_KEY, {
          version: 2,
          saved: { ...mediaData.saved },
          library: { ...mediaData.library }
        });
  }

  function inferMediaType(url, element = null) {
    const raw = String(url || '').toLowerCase();

    if (element?.tagName === 'IMG') return 'image';
    if (element?.tagName === 'VIDEO') return 'video';
    if (element?.tagName === 'AUDIO') return 'audio';

    const pathname = (() => {
      try {
        return new URL(url, location.origin).pathname.toLowerCase();
      } catch {
        return raw.split('?')[0].split('#')[0];
      }
    })();

    if (/\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(pathname)) return 'image';
    if (/\.(mp4|webm|mov|m4v|mkv)$/i.test(pathname)) return 'video';
    if (/\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(pathname)) return 'audio';

    return 'file';
  }

  function safeDecodeComponent(value) {
    try {
      return decodeURIComponent(String(value || ''));
    } catch {
      return String(value || '');
    }
  }

  function mediaFilename(url) {
    try {
      const parsed = new URL(url, location.origin);
      const raw = parsed.pathname.split('/').filter(Boolean).pop() || '';
      const name = safeDecodeComponent(raw);
      return name || 'attachment';
    } catch {
      const clean = String(url || '').split('?')[0].split('#')[0];
      const raw = clean.split('/').filter(Boolean).pop() || 'attachment';
      return safeDecodeComponent(raw) || 'attachment';
    }
  }

  function isDiscordAttachmentUrl(url) {
    try {
      const parsed = new URL(url, location.origin);
      const host = parsed.hostname.toLowerCase();

      return (
        (host === 'cdn.discordapp.com' || host === 'media.discordapp.net')
        && (
          parsed.pathname.includes('/attachments/')
          || parsed.pathname.includes('/ephemeral-attachments/')
        )
      );
    } catch {
      return false;
    }
  }

  function safeHttpUrl(value) {
    try {
      const url = new URL(value, location.origin);
      return /^https?:$/.test(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function extractSelectedMediaItems() {
    if (!selectedMessageElement?.isConnected) return [];

    const container = selectedMessageElement;
    const items = new Map();

    const add = (url, type = null, metadata = {}) => {
      const href = safeHttpUrl(url);
      if (!href) return;

      const finalType = type || inferMediaType(href);
      const key = href;

      const previous = items.get(key) || {};
      items.set(key, {
        url: href,
        type: finalType,
        filename: metadata.filename || previous.filename || mediaFilename(href),
        width: metadata.width || previous.width || 0,
        height: metadata.height || previous.height || 0,
        duration: Number.isFinite(metadata.duration) ? metadata.duration : (previous.duration || 0),
        source: metadata.source || previous.source || 'message'
      });
    };

    container.querySelectorAll?.('img[src]').forEach(img => {
      const src = img.currentSrc || img.src;
      if (!src) return;

      // Ignore tiny avatar/emoji-like images.
      const width = Number(img.naturalWidth || img.width || 0);
      const height = Number(img.naturalHeight || img.height || 0);
      if (width && height && width <= 64 && height <= 64 && !isDiscordAttachmentUrl(src)) return;

      add(src, 'image', {
        width,
        height,
        source: isDiscordAttachmentUrl(src) ? 'attachment' : 'embed'
      });
    });

    container.querySelectorAll?.('video').forEach(video => {
      const src = video.currentSrc || video.src || video.querySelector('source[src]')?.src;
      if (!src) return;

      add(src, 'video', {
        width: Number(video.videoWidth || video.width || 0),
        height: Number(video.videoHeight || video.height || 0),
        duration: Number(video.duration || 0),
        source: 'video'
      });
    });

    container.querySelectorAll?.('audio').forEach(audio => {
      const src = audio.currentSrc || audio.src || audio.querySelector('source[src]')?.src;
      if (!src) return;

      add(src, 'audio', {
        duration: Number(audio.duration || 0),
        source: 'audio'
      });
    });

    container.querySelectorAll?.('a[href]').forEach(anchor => {
      const href = safeHttpUrl(anchor.href);
      if (!href) return;

      if (isDiscordAttachmentUrl(href)) {
        add(href, inferMediaType(href), {
          filename: cleanLabel(anchor.getAttribute('download') || anchor.textContent, mediaFilename(href)),
          source: 'attachment'
        });
      }
    });

    // Keep attachment URLs found by Message Utilities, even if the media
    // element is not currently mounted.
    for (const href of selectedMessage?.attachments || []) {
      add(href, inferMediaType(href), {
        source: 'attachment'
      });
    }

    return [...items.values()];
  }

  function formatDuration(seconds) {
    const value = Number(seconds || 0);
    if (!Number.isFinite(value) || value <= 0) return '';

    const total = Math.floor(value);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function mediaTypeCount(items, type) {
    return items.filter(item => item.type === type).length;
  }

  function copyMediaUrlsByType(type = null) {
    const items = extractSelectedMediaItems();
    const filtered = type
      ? items.filter(item => item.type === type)
      : items;

    if (!filtered.length) {
      toast(type ? `No ${type} media found` : 'No media found');
      return;
    }

    copyText(filtered.map(item => item.url).join('\n'));
  }

  function copyMediaFilenames() {
    const items = extractSelectedMediaItems();

    if (!items.length) {
      toast('No media found');
      return;
    }

    copyText(items.map(item => item.filename).join('\n'));
  }

  function copyMediaMarkdown() {
    const items = extractSelectedMediaItems();

    if (!items.length) {
      toast('No media found');
      return;
    }

    const markdown = items
      .map(item => `[${item.filename}](${item.url})`)
      .join('\n');

    copyText(markdown);
  }

  function openMediaUrl(url) {
    const href = safeHttpUrl(url);
    if (!href) return;

    window.open(href, '_blank', 'noopener,noreferrer');
  }

  function pauseAllVisibleMedia() {
    let affected = 0;

    document.querySelectorAll('video,audio').forEach(media => {
      try {
        if (!media.paused) {
          media.pause();
          affected++;
        }
      } catch {}
    });

    toast(affected ? `Paused ${affected} media item${affected === 1 ? '' : 's'}` : 'No playing media found');
  }

  function muteAllVisibleMedia() {
    let affected = 0;

    document.querySelectorAll('video,audio').forEach(media => {
      try {
        if (!media.muted) {
          media.muted = true;
          affected++;
        }
      } catch {}
    });

    toast(affected ? `Muted ${affected} media item${affected === 1 ? '' : 's'}` : 'No unmuted media found');
  }

  function mediaBookmarkKey(item) {
    return item?.url || '';
  }

  function isMediaBookmarked(item) {
    const key = mediaBookmarkKey(item);
    return !!(key && mediaData.saved[key]);
  }

  function toggleMediaBookmark(item) {
    const key = mediaBookmarkKey(item);
    if (!key) return;

    if (mediaData.saved[key]) {
      delete mediaData.saved[key];

      if (mediaInspectorItem?.key === key) {
        mediaInspectorItem = null;
      }

      saveMediaData();
      renderMediaAttachmentTools();
      toast('Media bookmark removed');
      return;
    }

    mediaData.saved[key] = {
      ...item,
      key,
      favorite: false,
      messageLink: selectedMessage?.link || '',
      messageId: selectedMessage?.messageId || '',
      author: selectedMessage?.author || '',
      serverName: selectedMessage?.serverName || '',
      channelName: selectedMessage?.channelName || '',
      savedAt: Date.now()
    };

    const all = Object.values(mediaData.saved)
      .sort((a, b) => Number(b.savedAt || 0) - Number(a.savedAt || 0));

    if (all.length > 100) {
      for (const old of all.slice(100)) {
        if (old?.key) delete mediaData.saved[old.key];
      }
    }

    saveMediaData();
    renderMediaAttachmentTools();
    toast('Media bookmarked');
  }

  function removeMediaBookmark(key) {
    if (!key || !mediaData.saved[key]) return;

    delete mediaData.saved[key];
    saveMediaData();
    renderMediaAttachmentTools();
    toast('Media bookmark removed');
  }

  function clearMediaBookmarks() {
    mediaData.saved = {};
    saveMediaData();
    renderMediaAttachmentTools();
    toast('Media bookmarks cleared');
  }

  function mediaExtension(url) {
    try {
      const pathname = new URL(url, location.origin).pathname;
      const filename = pathname.split('/').filter(Boolean).pop() || '';
      const match = filename.match(/\.([a-z0-9]{1,8})$/i);
      return match ? match[1].toLowerCase() : '';
    } catch {
      return '';
    }
  }

  function mediaHost(url) {
    try {
      return new URL(url, location.origin).hostname;
    } catch {
      return '';
    }
  }

  function mediaPixelCount(item) {
    const width = Number(item?.width || 0);
    const height = Number(item?.height || 0);
    return width > 0 && height > 0 ? width * height : 0;
  }

  function mediaMegapixels(item) {
    const pixels = mediaPixelCount(item);
    return pixels ? pixels / 1_000_000 : 0;
  }

  function gcdMedia(a, b) {
    let x = Math.abs(Math.round(Number(a || 0)));
    let y = Math.abs(Math.round(Number(b || 0)));

    while (y) {
      const next = x % y;
      x = y;
      y = next;
    }

    return x || 1;
  }

  function mediaAspectRatio(item) {
    const width = Number(item?.width || 0);
    const height = Number(item?.height || 0);
    if (!width || !height) return '';

    const divisor = gcdMedia(width, height);
    const a = Math.round(width / divisor);
    const b = Math.round(height / divisor);

    if (a > 100 || b > 100) {
      return `${(width / height).toFixed(2)}:1`;
    }

    return `${a}:${b}`;
  }

  function mediaTypeLabel(type) {
    const labels = {
      image: 'Image',
      video: 'Video',
      audio: 'Audio',
      file: 'File'
    };

    return labels[type] || 'File';
  }

  function mediaMetadata(item) {
    const extension = mediaExtension(item?.url);
    const megapixels = mediaMegapixels(item);
    const aspect = mediaAspectRatio(item);
    const duration = formatDuration(item?.duration);

    return {
      filename: item?.filename || mediaFilename(item?.url || ''),
      type: mediaTypeLabel(item?.type),
      extension: extension ? extension.toUpperCase() : '',
      host: mediaHost(item?.url),
      dimensions: item?.width && item?.height
        ? `${item.width} × ${item.height}`
        : '',
      megapixels: megapixels
        ? `${megapixels.toFixed(megapixels >= 10 ? 1 : 2)} MP`
        : '',
      aspect,
      duration,
      source: item?.source || '',
      url: item?.url || ''
    };
  }

  function mediaItemWithMessageContext(item) {
    return {
      ...item,
      key: item?.key || mediaBookmarkKey(item),
      messageLink: item?.messageLink || selectedMessage?.link || '',
      messageId: item?.messageId || selectedMessage?.messageId || '',
      author: item?.author || selectedMessage?.author || '',
      serverName: item?.serverName || selectedMessage?.serverName || '',
      channelName: item?.channelName || selectedMessage?.channelName || ''
    };
  }

  function inspectMediaItem(item) {
    if (!item?.url) return;

    mediaInspectorItem = mediaItemWithMessageContext(item);
    renderMediaAttachmentTools();
  }

  function clearMediaInspector() {
    mediaInspectorItem = null;
    renderMediaAttachmentTools();
  }

  function copyMediaMetadata(item = mediaInspectorItem) {
    if (!item) return toast('Inspect a media item first');

    const metadata = mediaMetadata(item);

    copyText(JSON.stringify({
      ...metadata,
      messageLink: item.messageLink || '',
      messageId: item.messageId || '',
      author: item.author || '',
      serverName: item.serverName || '',
      channelName: item.channelName || ''
    }, null, 2));
  }

  function openMediaSource(item = mediaInspectorItem) {
    if (!item?.messageLink) {
      toast('Source message unavailable');
      return;
    }

    try {
      const url = new URL(item.messageLink, location.origin);

      if (url.origin === location.origin && url.pathname.startsWith('/channels/')) {
        navigateToDiscordPath(url.pathname);
      } else {
        window.open(url.href, '_blank', 'noopener,noreferrer');
      }
    } catch {
      toast('Source message unavailable');
    }
  }

  function toggleMediaFavorite(key) {
    const item = mediaData.saved[key];
    if (!item) return;

    item.favorite = !item.favorite;
    mediaData.saved[key] = item;
    saveMediaData();
    renderMediaAttachmentTools();

    toast(item.favorite ? 'Media marked favorite' : 'Media favorite removed');
  }

  function updateMediaLibrarySetting(key, value) {
    mediaData.library[key] = value;
    saveMediaData();
    renderMediaAttachmentTools();
  }

  function currentMediaItems(items) {
    const filter = mediaData.library.currentFilter;

    if (!filter || filter === 'all') return items;
    return items.filter(item => item.type === filter);
  }

  function savedMediaVisible(item) {
    const filter = mediaData.library.savedFilter;

    if (filter === 'favorites') return !!item.favorite;
    if (filter === 'all') return true;

    return item.type === filter;
  }

  function sortedSavedMediaItems() {
    const sort = mediaData.library.savedSort;

    const saved = Object.values(mediaData.saved)
      .filter(item => item?.key)
      .filter(savedMediaVisible);

    saved.sort((a, b) => {
      if (sort === 'oldest') {
        return Number(a.savedAt || 0) - Number(b.savedAt || 0);
      }

      if (sort === 'name') {
        return String(a.filename || '').localeCompare(String(b.filename || ''));
      }

      if (sort === 'type') {
        const typeCompare = String(a.type || '').localeCompare(String(b.type || ''));
        return typeCompare || String(a.filename || '').localeCompare(String(b.filename || ''));
      }

      if (sort === 'resolution') {
        return mediaPixelCount(b) - mediaPixelCount(a);
      }

      if (sort === 'duration') {
        return Number(b.duration || 0) - Number(a.duration || 0);
      }

      return Number(b.savedAt || 0) - Number(a.savedAt || 0);
    });

    return saved;
  }

  function mediaFilterButton(filter, label, count) {
    const active = mediaData.library.currentFilter === filter;

    const node = el('button', {
      type: 'button',
      class: `dpt-media2-filter${active ? ' active' : ''}`,
      text: `${label} ${count}`
    });

    node.addEventListener('click', () => {
      updateMediaLibrarySetting('currentFilter', filter);
    });

    return node;
  }

  function mediaInspectorPanel() {
    if (!mediaInspectorItem) {
      return el('div', { class: 'dpt-media2-inspector empty' }, [
        el('div', { class: 'dpt-media2-inspector-title', text: 'Media Inspector' }),
        el('div', {
          class: 'dpt-media2-inspector-empty',
          text: 'Choose Inspect on a selected-message media item or saved bookmark to view detailed metadata.'
        })
      ]);
    }

    const item = mediaInspectorItem;
    const metadata = mediaMetadata(item);

    const rows = [
      ['Filename', metadata.filename],
      ['Type', metadata.type],
      ['Extension', metadata.extension],
      ['Dimensions', metadata.dimensions],
      ['Aspect Ratio', metadata.aspect],
      ['Megapixels', metadata.megapixels],
      ['Duration', metadata.duration],
      ['Host', metadata.host],
      ['Source', metadata.source],
      ['Author', item.author || ''],
      ['Location', [item.serverName, item.channelName].filter(Boolean).join(' / ')],
      ['Message ID', item.messageId || '']
    ].filter(([, value]) => value);

    const details = el(
      'div',
      { class: 'dpt-media2-inspector-grid' },
      rows.map(([label, value]) =>
        el('div', { class: 'dpt-media2-inspector-row' }, [
          el('span', { text: label }),
          el('strong', { text: String(value) })
        ])
      )
    );

    const open = button('Open Media', () => openMediaUrl(item.url));
    const copy = button('Copy URL', () => copyText(item.url));
    const metadataButton = button('Copy Metadata', () => copyMediaMetadata(item));
    const source = button(
      'Open Source',
      () => openMediaSource(item),
      false,
      !item.messageLink
    );
    const clear = button('Clear Inspector', clearMediaInspector, true);

    return el('div', { class: 'dpt-media2-inspector' }, [
      el('div', { class: 'dpt-media2-inspector-head' }, [
        el('div', {}, [
          el('div', { class: 'dpt-media2-inspector-kicker', text: 'MEDIA INSPECTOR' }),
          el('div', {
            class: 'dpt-media2-inspector-title',
            text: metadata.filename || 'Media Item'
          })
        ]),
        el('span', {
          class: `dpt-media2-type-pill ${item.type || 'file'}`,
          text: metadata.type.toUpperCase()
        })
      ]),
      details,
      el('div', { class: 'dpt-grid dpt-media2-inspector-actions' }, [
        open,
        copy,
        metadataButton,
        source,
        clear
      ])
    ]);
  }

  function mediaItemCard(item) {
    const meta = [];

    if (item.width && item.height) {
      meta.push(`${item.width}×${item.height}`);
    }

    const duration = formatDuration(item.duration);
    if (duration) meta.push(duration);

    const extension = mediaExtension(item.url);
    if (extension) meta.push(extension.toUpperCase());

    meta.push(item.type.toUpperCase());

    const bookmarked = isMediaBookmarked(item);

    const inspect = button('Inspect', () => inspectMediaItem(item));
    inspect.classList.add('dpt-nav-mini');

    const open = button('Open', () => openMediaUrl(item.url));
    open.classList.add('dpt-nav-mini');

    const copy = button('Copy', () => copyText(item.url));
    copy.classList.add('dpt-nav-mini');

    const save = button(
      bookmarked ? 'Unsave' : 'Save',
      () => toggleMediaBookmark(item),
      bookmarked
    );
    save.classList.add('dpt-nav-mini');

    return el('div', {
      class: 'dpt-media-item'
    }, [
      el('div', { class: 'dpt-media-item-copy' }, [
        el('div', { class: 'dpt-media-item-name', text: item.filename }),
        el('div', {
          class: 'dpt-media-item-meta',
          text: meta.join(' • ')
        })
      ]),
      el('div', { class: 'dpt-nav-actions' }, [inspect, open, copy, save])
    ]);
  }

  function savedMediaItem(item) {
    const metadata = mediaMetadata(item);

    const searchText = [
      item.filename,
      item.type,
      item.author,
      item.serverName,
      item.channelName,
      metadata.extension,
      metadata.host,
      item.favorite ? 'favorite starred' : ''
    ].filter(Boolean).join(' ').toLowerCase();

    const inspect = button('Inspect', () => inspectMediaItem(item));
    inspect.classList.add('dpt-nav-mini');

    const favorite = button(
      item.favorite ? '★' : '☆',
      () => toggleMediaFavorite(item.key)
    );
    favorite.classList.add('dpt-nav-mini', 'dpt-media2-favorite');
    favorite.title = item.favorite ? 'Remove favorite' : 'Favorite media';

    const source = button('Source', () => openMediaSource(item), false, !item.messageLink);
    source.classList.add('dpt-nav-mini');

    const remove = button('Remove', () => removeMediaBookmark(item.key), true);
    remove.classList.add('dpt-nav-mini');

    const meta = [
      item.type?.toUpperCase(),
      metadata.dimensions,
      metadata.duration,
      item.serverName,
      item.channelName
    ].filter(Boolean).join(' • ');

    return el('div', {
      class: `dpt-media-saved-item${item.favorite ? ' favorite' : ''}`,
      'data-media-search': searchText
    }, [
      el('div', { class: 'dpt-media-saved-copy' }, [
        el('div', { class: 'dpt-media2-saved-title-row' }, [
          el('div', {
            class: 'dpt-media-saved-name',
            text: item.filename || 'Saved media'
          }),
          ...(item.favorite
            ? [el('span', { class: 'dpt-media2-favorite-pill', text: 'FAVORITE' })]
            : [])
        ]),
        el('div', {
          class: 'dpt-media-saved-meta',
          text: meta
        })
      ]),
      el('div', { class: 'dpt-nav-actions' }, [favorite, inspect, source, remove])
    ]);
  }

  function filterSavedMedia(container, query) {
    const normalized = String(query || '').trim().toLowerCase();

    container.querySelectorAll('[data-media-search]').forEach(item => {
      const haystack = item.getAttribute('data-media-search') || '';
      item.hidden = !!normalized && !haystack.includes(normalized);
    });
  }

  function renderMediaAttachmentTools() {
    const container = panel?.querySelector('[data-media-attachment-tools]');
    if (!container) return;

    const allCurrentItems = extractSelectedMediaItems();
    const currentItems = currentMediaItems(allCurrentItems);
    const hasMessage = !!selectedMessage;

    const counts = {
      image: mediaTypeCount(allCurrentItems, 'image'),
      video: mediaTypeCount(allCurrentItems, 'video'),
      audio: mediaTypeCount(allCurrentItems, 'audio'),
      file: mediaTypeCount(allCurrentItems, 'file')
    };

    const allSaved = Object.values(mediaData.saved)
      .filter(item => item?.key);

    const favoriteCount = allSaved.filter(item => item.favorite).length;

    const status = el('div', { class: 'dpt-media2-hero' }, [
      el('div', { class: 'dpt-media2-hero-copy' }, [
        el('div', { class: 'dpt-media2-kicker', text: 'MEDIA CENTER 2.0' }),
        el('div', {
          class: 'dpt-media2-title',
          text: hasMessage
            ? `${allCurrentItems.length} item${allCurrentItems.length === 1 ? '' : 's'} in selected message`
            : 'Select a message to inspect media'
        }),
        el('div', {
          class: 'dpt-media2-sub',
          text: hasMessage
            ? `${counts.image} images • ${counts.video} videos • ${counts.audio} audio • ${counts.file} files`
            : 'Media Center uses the message currently selected in Message Utilities and your local media bookmarks.'
        })
      ]),
      el('div', { class: 'dpt-media2-hero-pills' }, [
        el('span', {
          class: 'dpt-media2-count-pill',
          text: `${allSaved.length} SAVED`
        }),
        el('span', {
          class: 'dpt-media2-count-pill favorite',
          text: `${favoriteCount} FAVORITES`
        })
      ])
    ]);

    const overview = el('div', { class: 'dpt-media2-metrics' }, [
      el('div', {}, [
        el('b', { text: String(counts.image) }),
        el('span', { text: 'Images' })
      ]),
      el('div', {}, [
        el('b', { text: String(counts.video) }),
        el('span', { text: 'Videos' })
      ]),
      el('div', {}, [
        el('b', { text: String(counts.audio) }),
        el('span', { text: 'Audio' })
      ]),
      el('div', {}, [
        el('b', { text: String(counts.file) }),
        el('span', { text: 'Files' })
      ])
    ]);

    const quickActions = el('div', { class: 'dpt-grid dpt-media-actions' }, [
      messageUtilityButton('Copy All URLs', () => copyMediaUrlsByType(null), !allCurrentItems.length),
      messageUtilityButton('Copy Image URLs', () => copyMediaUrlsByType('image'), !counts.image),
      messageUtilityButton('Copy Video URLs', () => copyMediaUrlsByType('video'), !counts.video),
      messageUtilityButton('Copy Audio URLs', () => copyMediaUrlsByType('audio'), !counts.audio),
      messageUtilityButton('Copy Filenames', copyMediaFilenames, !allCurrentItems.length),
      messageUtilityButton('Copy Markdown', copyMediaMarkdown, !allCurrentItems.length),
      button('Pause Page Media', pauseAllVisibleMedia),
      button('Mute Page Media', muteAllVisibleMedia)
    ]);

    const currentFilters = el('div', { class: 'dpt-media2-filters' }, [
      mediaFilterButton('all', 'All', allCurrentItems.length),
      mediaFilterButton('image', 'Images', counts.image),
      mediaFilterButton('video', 'Videos', counts.video),
      mediaFilterButton('audio', 'Audio', counts.audio),
      mediaFilterButton('file', 'Files', counts.file)
    ]);

    const currentList = el('div', { class: 'dpt-media-list' },
      currentItems.length
        ? currentItems.map(mediaItemCard)
        : [el('div', {
            class: 'dpt-nav-empty',
            text: hasMessage
              ? (
                  allCurrentItems.length
                    ? 'No selected-message media matches this filter.'
                    : 'No supported media/attachment URLs found in the selected message.'
                )
              : 'Select a message first.'
          })]
    );

    const saved = sortedSavedMediaItems();

    const search = el('input', {
      class: 'dpt-nav-search',
      type: 'search',
      placeholder: 'Search saved media…',
      autocomplete: 'off'
    });

    const filterSelect = el('select', {
      class: 'dpt-select dpt-media2-select'
    }, [
      el('option', { value: 'all', text: 'All Saved Media' }),
      el('option', { value: 'favorites', text: 'Favorites' }),
      el('option', { value: 'image', text: 'Images' }),
      el('option', { value: 'video', text: 'Videos' }),
      el('option', { value: 'audio', text: 'Audio' }),
      el('option', { value: 'file', text: 'Files' })
    ]);
    filterSelect.value = mediaData.library.savedFilter;

    filterSelect.addEventListener('change', () => {
      updateMediaLibrarySetting('savedFilter', filterSelect.value);
    });

    const sortSelect = el('select', {
      class: 'dpt-select dpt-media2-select'
    }, [
      el('option', { value: 'newest', text: 'Newest First' }),
      el('option', { value: 'oldest', text: 'Oldest First' }),
      el('option', { value: 'name', text: 'Filename A–Z' }),
      el('option', { value: 'type', text: 'Type' }),
      el('option', { value: 'resolution', text: 'Resolution' }),
      el('option', { value: 'duration', text: 'Duration' })
    ]);
    sortSelect.value = mediaData.library.savedSort;

    sortSelect.addEventListener('change', () => {
      updateMediaLibrarySetting('savedSort', sortSelect.value);
    });

    const savedList = el('div', { class: 'dpt-media-saved-list' },
      saved.length
        ? saved.map(savedMediaItem)
        : [el('div', {
            class: 'dpt-nav-empty',
            text: mediaData.library.savedFilter === 'favorites'
              ? 'No favorite media bookmarks.'
              : 'No saved media matches this filter.'
          })]
    );

    search.addEventListener('input', () => {
      filterSavedMedia(savedList, search.value);
    });

    const savedHeader = el('div', { class: 'dpt-media2-library-head' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-nav-group-title',
          text: `Media Library (${allSaved.length})`
        }),
        el('div', {
          class: 'dpt-media2-library-sub',
          text: `${favoriteCount} favorites • showing ${saved.length}`
        })
      ]),
      button('Clear All', clearMediaBookmarks, true)
    ]);

    const libraryControls = el('div', {
      class: 'dpt-media2-library-controls'
    }, [
      search,
      filterSelect,
      sortSelect
    ]);

    const backupActions = el('div', {
      class: 'dpt-grid dpt-media-backup-actions'
    }, [
      button('Copy Media Backup', () => copyText(JSON.stringify(mediaData, null, 2))),
      button('Copy Visible Library', () => copyText(JSON.stringify(saved, null, 2))),
      button('Refresh Media Scan', () => {
        renderMediaAttachmentTools();
        toast('Media scan refreshed');
      })
    ]);

    container.replaceChildren(
      status,
      overview,
      mediaInspectorPanel(),
      el('div', { class: 'dpt-media2-section-label', text: 'Quick Media Tools' }),
      quickActions,
      el('div', { class: 'dpt-media2-section-label', text: 'Selected Message Media' }),
      currentFilters,
      currentList,
      el('div', { class: 'dpt-media2-section-label', text: 'Saved Media Library' }),
      savedHeader,
      libraryControls,
      savedList,
      backupActions
    );
  }

  function normalizeFocusData(value) {
    const data = value && typeof value === 'object' ? value : {};

    return {
      version: 2,
      focusMode: !!data.focusMode,
      hideServers: !!data.hideServers,
      hideChannels: !!data.hideChannels,
      hideMembers: !!data.hideMembers,
      hideActivity: !!data.hideActivity,
      quietBadges: !!data.quietBadges,
      dimMedia: !!data.dimMedia,
      compactMessages: !!data.compactMessages,
      timerMinutes: Math.max(5, Math.min(180, finiteNumber(data.timerMinutes, 25))),
      breakMinutes: Math.max(1, Math.min(60, finiteNumber(data.breakMinutes, 5))),
      timerMode: data.timerMode === 'break' ? 'break' : 'focus',
      timerEndAt: Math.max(0, finiteNumber(data.timerEndAt, 0)),
      timerRunning: !!data.timerRunning,
      pausedRemainingMs: Math.max(0, finiteNumber(data.pausedRemainingMs, 0)),
      completedFocusSessions: Math.max(0, finiteNumber(data.completedFocusSessions, 0)),
      totalFocusMinutes: Math.max(0, finiteNumber(data.totalFocusMinutes, 0)),
      shortcutEnabled: data.shortcutEnabled !== false
    };
  }

  function loadFocusData() {
    try {
      const stored = readStoredValue(FOCUS_DATA_KEY, null);

      return normalizeFocusData(stored);
    } catch {
      return normalizeFocusData(null);
    }
  }

  function saveFocusData() {
    return writeStoredValue(FOCUS_DATA_KEY, {
          ...focusData
        });
  }

  function setFocusField(key, value) {
    focusData[key] = value;
    focusData = normalizeFocusData(focusData);
    saveFocusData();
    applyFocusState();
    renderFocusProductivityCenter();
  }

  function focusActivityPanelRoot(node) {
    if (!(node instanceof Element)) return null;
    if (node.closest?.('#dpt-panel,#dpt-launcher')) return null;

    const viewportWidth = Math.max(
      document.documentElement?.clientWidth || 0,
      window.innerWidth || 0
    );

    let current = node;

    for (let depth = 0; current && depth < 9; depth++) {
      if (
        current === document.body
        || current === document.documentElement
        || current.id === 'app-mount'
      ) {
        break;
      }

      const rect = current.getBoundingClientRect?.();

      if (rect && viewportWidth > 0) {
        const width = rect.width;
        const height = rect.height;
        const rightSide = rect.left >= viewportWidth * 0.55;
        const nearRightEdge = rect.right >= viewportWidth * 0.88;
        const usefulWidth = width >= 180 && width <= Math.min(620, viewportWidth * 0.46);
        const usefulHeight = height >= 140;

        if (rightSide && nearRightEdge && usefulWidth && usefulHeight) {
          return current;
        }
      }

      current = current.parentElement;
    }

    return null;
  }

  function markFocusActivityPanel(node) {
    if (!(node instanceof Element)) return false;

    const directTag = node.matches?.(
      'aside,[role="complementary"],[aria-label*="Active Now" i],[aria-label*="Now Playing" i],[aria-label*="Activity" i]'
    );

    const target = directTag
      ? (focusActivityPanelRoot(node) || node)
      : focusActivityPanelRoot(node);

    if (!target || target.closest?.('#dpt-panel,#dpt-launcher')) return false;

    target.setAttribute('data-dpt-focus-activity-panel', '1');
    return true;
  }

  function scanFocusActivityPanels() {
    focusActivityScanQueued = false;
    focusActivityLastScanAt = performance.now();

    if (!focusData.focusMode || !focusData.hideActivity) return;

    // Current and older semantic variants.
    const semanticSelectors = [
      '[aria-label*="Active Now" i]',
      '[aria-label*="Now Playing" i]',
      '[aria-label*="Activity" i]',
      'aside[aria-label*="Active" i]',
      '[role="complementary"][aria-label*="Active" i]'
    ];

    for (const selector of semanticSelectors) {
      document.querySelectorAll(selector).forEach(markFocusActivityPanel);
    }

    // Discord's current Friends page can render "Active Now" without a
    // stable aria-label. Find the heading text, then identify the compact
    // right-side column geometrically. This avoids hashed class names.
    document
      .querySelectorAll('h1,h2,h3,h4,[role="heading"]')
      .forEach(heading => {
        if (heading.closest?.('#dpt-panel,#dpt-launcher')) return;

        const label = String(
          heading.innerText
          || heading.textContent
          || ''
        )
          .replace(/\s+/g, ' ')
          .trim()
          .toLowerCase();

        if (
          label === 'active now'
          || label === 'now playing'
          || label === 'activity'
        ) {
          markFocusActivityPanel(heading);
        }
      });
  }

  function scheduleFocusActivityPanelScan(immediate = false) {
    if (!focusData.focusMode || !focusData.hideActivity) return;
    if (focusActivityScanQueued) return;

    const now = performance.now();
    const elapsed = now - focusActivityLastScanAt;

    if (immediate || elapsed >= 250) {
      focusActivityScanQueued = true;
      requestAnimationFrame(scanFocusActivityPanels);
      return;
    }

    focusActivityScanQueued = true;
    setTimeout(scanFocusActivityPanels, Math.max(40, 250 - elapsed));
  }

  function applyFocusState() {
    const root = document.documentElement;
    if (!root) return;

    const active = effectiveFocusMode();

    root.setAttribute('data-dpt-focus', active ? '1' : '0');
    root.setAttribute('data-dpt-hide-servers', active && focusData.hideServers ? '1' : '0');
    root.setAttribute('data-dpt-hide-channels', active && focusData.hideChannels ? '1' : '0');
    root.setAttribute('data-dpt-hide-members', active && focusData.hideMembers ? '1' : '0');
    root.setAttribute('data-dpt-hide-activity', active && focusData.hideActivity ? '1' : '0');
    root.setAttribute('data-dpt-quiet-badges', active && focusData.quietBadges ? '1' : '0');
    root.setAttribute('data-dpt-dim-media', active && focusData.dimMedia ? '1' : '0');
    root.setAttribute('data-dpt-compact-messages', active && focusData.compactMessages ? '1' : '0');

    startObserver();

    if (active && focusData.hideActivity) {
      scheduleFocusActivityPanelScan(true);
    }

    updateFocusBadge();
  }

  function toggleFocusMode() {
    if (!powerToolsActive()) {
      toast('Enable PowerTools before using Focus Mode');
      return;
    }

    if (stableSafeModeActive()) {
      toast('Focus Mode is temporarily disabled by Stable Safe Mode');
      return;
    }

    focusData.focusMode = !focusData.focusMode;
    saveFocusData();
    applyFocusState();
    renderFocusProductivityCenter();
    toast(focusData.focusMode ? 'Focus Mode enabled' : 'Focus Mode disabled');
  }

  function applyFocusPreset(name) {
    const presets = {
      minimal: {
        focusMode: true,
        hideServers: true,
        hideChannels: true,
        hideMembers: true,
        hideActivity: true,
        quietBadges: true,
        dimMedia: true,
        compactMessages: true
      },
      writing: {
        focusMode: true,
        hideServers: true,
        hideChannels: false,
        hideMembers: true,
        hideActivity: true,
        quietBadges: true,
        dimMedia: true,
        compactMessages: false
      },
      reading: {
        focusMode: true,
        hideServers: false,
        hideChannels: false,
        hideMembers: true,
        hideActivity: true,
        quietBadges: true,
        dimMedia: false,
        compactMessages: false
      },
      reset: {
        focusMode: false,
        hideServers: false,
        hideChannels: false,
        hideMembers: false,
        hideActivity: false,
        quietBadges: false,
        dimMedia: false,
        compactMessages: false
      }
    };

    const preset = presets[name];
    if (!preset) return;

    focusData = normalizeFocusData({
      ...focusData,
      ...preset
    });

    saveFocusData();
    applyFocusState();
    renderFocusProductivityCenter();

    const names = {
      minimal: 'Minimal Focus',
      writing: 'Writing Focus',
      reading: 'Reading Focus',
      reset: 'Focus layout reset'
    };

    toast(names[name] || 'Focus preset applied');
  }

  function focusTimerRemainingMs() {
    if (!focusData.timerRunning || !focusData.timerEndAt) return 0;
    return Math.max(0, focusData.timerEndAt - Date.now());
  }

  function formatTimer(ms) {
    const totalSeconds = Math.max(0, Math.ceil(Number(ms || 0) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function completeFocusTimer() {
    const mode = focusData.timerMode;

    if (mode === 'focus') {
      focusData.completedFocusSessions += 1;
      focusData.totalFocusMinutes += Number(focusData.timerMinutes || 25);
      focusData.timerMode = 'break';
      focusData.timerRunning = false;
      focusData.timerEndAt = 0;
      saveFocusData();
      toast('Focus session complete — break time');
    } else {
      focusData.timerMode = 'focus';
      focusData.timerRunning = false;
      focusData.timerEndAt = 0;
      saveFocusData();
      toast('Break complete — ready to focus');
    }

    renderFocusProductivityCenter();
    updateFocusBadge();
  }

  function focusTimerTick() {
    if (!focusData.timerRunning) {
      updateFocusBadge();
      return;
    }

    const remaining = focusTimerRemainingMs();

    if (remaining <= 0) {
      completeFocusTimer();
      return;
    }

    updateFocusBadge();
    updateFocusTimerUI();
  }

  function startFocusTicker() {
    clearTimeout(focusTickerHandle);

    const schedule = delay => {
      clearTimeout(focusTickerHandle);
      focusTickerHandle = setTimeout(() => {
        focusTimerTick();
        schedule(focusData.timerRunning ? 1000 : 15000);
      }, delay);
    };

    focusTimerTick();
    schedule(focusData.timerRunning ? 1000 : 15000);
  }

  function startFocusTimer(mode = null) {
    const finalMode = mode || focusData.timerMode || 'focus';
    const minutes = finalMode === 'break'
      ? Number(focusData.breakMinutes || 5)
      : Number(focusData.timerMinutes || 25);

    focusData.timerMode = finalMode;
    focusData.timerRunning = true;
    focusData.timerEndAt = Date.now() + minutes * 60 * 1000;
    focusData.pausedRemainingMs = 0;

    saveFocusData();
    startFocusTicker();
    updateFocusBadge();
    renderFocusProductivityCenter();
    toast(`${finalMode === 'focus' ? 'Focus' : 'Break'} timer started`);
  }

  function pauseFocusTimer() {
    if (!focusData.timerRunning) {
      toast('Timer is not running');
      return;
    }

    const remaining = focusTimerRemainingMs();

    focusData.timerRunning = false;
    focusData.timerEndAt = 0;
    focusData.pausedRemainingMs = remaining;

    saveFocusData();
    startFocusTicker();
    renderFocusProductivityCenter();
    updateFocusBadge();
    toast('Timer paused');
  }

  function resumeFocusTimer() {
    const paused = Math.max(0, Number(focusData.pausedRemainingMs || 0));

    if (!paused) {
      startFocusTimer(focusData.timerMode);
      return;
    }

    focusData.timerRunning = true;
    focusData.timerEndAt = Date.now() + paused;
    focusData.pausedRemainingMs = 0;

    saveFocusData();
    startFocusTicker();
    renderFocusProductivityCenter();
    updateFocusBadge();
    toast('Timer resumed');
  }

  function resetFocusTimer() {
    focusData.timerRunning = false;
    focusData.timerEndAt = 0;
    focusData.pausedRemainingMs = 0;
    focusData.timerMode = 'focus';

    saveFocusData();
    startFocusTicker();
    renderFocusProductivityCenter();
    updateFocusBadge();
    toast('Focus timer reset');
  }

  function skipFocusPhase() {
    if (focusData.timerMode === 'focus') {
      focusData.timerMode = 'break';
    } else {
      focusData.timerMode = 'focus';
    }

    focusData.timerRunning = false;
    focusData.timerEndAt = 0;
    focusData.pausedRemainingMs = 0;

    saveFocusData();
    startFocusTicker();
    renderFocusProductivityCenter();
    updateFocusBadge();
    toast(`Switched to ${focusData.timerMode === 'focus' ? 'Focus' : 'Break'} phase`);
  }

  function ensureFocusBadge() {
    if (!document.body) return null;

    let badge = document.getElementById('dpt-focus-badge');

    if (!badge) {
      badge = el('button', {
        id: 'dpt-focus-badge',
        type: 'button',
        title: 'Discord PowerTools Focus Timer'
      });

      badge.addEventListener('click', () => {
        if (!panel) return;
        panel.hidden = false;
        setDashboardTab('focus', { scroll: false, instant: true });
        renderFocusProductivityCenter();
      });

      document.body.appendChild(badge);
    }

    return badge;
  }

  function updateFocusBadge() {
    const badge = ensureFocusBadge();
    if (!badge) return;

    const active = effectiveFocusMode();
    const show = powerToolsActive() && (focusData.timerRunning || active);
    badge.hidden = !show;

    if (!show) return;

    const remaining = focusTimerRemainingMs();
    const label = focusData.timerRunning
      ? `${focusData.timerMode === 'focus' ? 'FOCUS' : 'BREAK'} ${formatTimer(remaining)}`
      : 'FOCUS MODE';

    badge.textContent = label;
    badge.setAttribute('data-mode', focusData.timerMode || 'focus');
  }

  function updateFocusTimerUI() {
    const timer = panel?.querySelector('[data-focus-timer-display]');
    if (!timer) return;

    const remaining = focusTimerRemainingMs();

    if (focusData.timerRunning) {
      timer.textContent = formatTimer(remaining);
    } else if (focusData.pausedRemainingMs) {
      timer.textContent = formatTimer(focusData.pausedRemainingMs);
    } else {
      const mins = focusData.timerMode === 'break'
        ? focusData.breakMinutes
        : focusData.timerMinutes;
      timer.textContent = `${String(mins).padStart(2, '0')}:00`;
    }
  }

  function focusToggleRow(label, key, note) {
    const checkbox = el('input', { type: 'checkbox' });
    checkbox.checked = !!focusData[key];

    checkbox.addEventListener('change', () => {
      setFocusField(key, checkbox.checked);
    });

    const text = el('div', { class: 'dpt-row-text' }, [
      el('div', { class: 'dpt-row-title', text: label }),
      el('div', { class: 'dpt-row-note', text: note })
    ]);

    const switchWrap = el('label', { class: 'dpt-switch' }, [
      checkbox,
      el('span', { class: 'dpt-slider' })
    ]);

    return el('div', { class: 'dpt-row' }, [text, switchWrap]);
  }

  function focusNumberRow(label, key, min, max, suffix, note) {
    const input = el('input', {
      class: 'dpt-focus-number',
      type: 'number',
      min: String(min),
      max: String(max),
      step: '1',
      value: String(focusData[key])
    });

    input.addEventListener('change', () => {
      const value = Math.max(min, Math.min(max, Number(input.value || focusData[key])));
      focusData[key] = value;
      input.value = String(value);
      saveFocusData();
      renderFocusProductivityCenter();
    });

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-control-head' }, [
        el('span', { class: 'dpt-row-title', text: label }),
        el('div', { class: 'dpt-focus-number-wrap' }, [
          input,
          el('span', { text: suffix })
        ])
      ]),
      el('div', { class: 'dpt-row-note', text: note })
    ]);
  }

  function renderFocusProductivityCenter() {
    const container = panel?.querySelector('[data-focus-productivity]');
    if (!container) return;

    const modeText = focusData.focusMode ? 'ON' : 'OFF';
    const runningText = focusData.timerRunning
      ? `${focusData.timerMode === 'focus' ? 'Focus' : 'Break'} running`
      : (focusData.pausedRemainingMs ? 'Timer paused' : 'Timer ready');

    const status = el('div', { class: 'dpt-focus-status' }, [
      el('div', { class: 'dpt-focus-status-head' }, [
        el('div', {}, [
          el('div', { class: 'dpt-focus-status-title', text: `Focus Mode ${modeText}` }),
          el('div', { class: 'dpt-focus-status-sub', text: runningText })
        ]),
        el('span', {
          class: `dpt-focus-pill${focusData.focusMode ? ' active' : ''}`,
          text: modeText
        })
      ]),
      button(
        focusData.focusMode ? 'Disable Focus Mode' : 'Enable Focus Mode',
        toggleFocusMode,
        focusData.focusMode
      )
    ]);

    const presets = el('div', { class: 'dpt-grid dpt-focus-presets' }, [
      button('Minimal', () => applyFocusPreset('minimal')),
      button('Writing', () => applyFocusPreset('writing')),
      button('Reading', () => applyFocusPreset('reading')),
      button('Reset Layout', () => applyFocusPreset('reset'), true)
    ]);

    const options = el('div', {}, [
      focusToggleRow('Hide Server Rail', 'hideServers', 'Locally hides the server navigation while Focus Mode is active.'),
      focusToggleRow('Hide Channel Sidebar', 'hideChannels', 'Locally hides the channel list while Focus Mode is active.'),
      focusToggleRow('Hide Member List', 'hideMembers', 'Locally hides the member sidebar while Focus Mode is active.'),
      focusToggleRow('Hide Activity Panels', 'hideActivity', 'Hides common activity / now-playing side panels when detected.'),
      focusToggleRow('Quiet Notification Badges', 'quietBadges', 'Visually suppresses distracting badge indicators without changing Discord notification settings.'),
      focusToggleRow('Dim Media', 'dimMedia', 'Dims inline images/video until hovered.'),
      focusToggleRow('Compact Messages', 'compactMessages', 'Reduces vertical message spacing for a denser reading view.'),
      focusToggleRow('Keyboard Shortcut', 'shortcutEnabled', 'Alt+Shift+F toggles Focus Mode.')
    ]);

    const timerDisplay = el('div', {
      class: 'dpt-focus-timer',
      'data-focus-timer-display': '1',
      text: '00:00'
    });

    const timerMeta = el('div', { class: 'dpt-focus-timer-meta' }, [
      el('span', {
        text: focusData.timerMode === 'focus' ? 'FOCUS PHASE' : 'BREAK PHASE'
      }),
      el('span', {
        text: `${focusData.completedFocusSessions} sessions • ${focusData.totalFocusMinutes} focused min`
      })
    ]);

    const timerButtons = el('div', { class: 'dpt-grid dpt-focus-timer-actions' }, [
      button(
        focusData.timerRunning ? 'Pause' : (focusData.pausedRemainingMs ? 'Resume' : 'Start'),
        () => {
          if (focusData.timerRunning) pauseFocusTimer();
          else if (focusData.pausedRemainingMs) resumeFocusTimer();
          else startFocusTimer(focusData.timerMode);
        }
      ),
      button('Reset Timer', resetFocusTimer, true),
      button('Start Focus', () => startFocusTimer('focus')),
      button('Start Break', () => startFocusTimer('break')),
      button('Skip Phase', skipFocusPhase),
      button('Enable Focus + Start', () => {
        if (!focusData.focusMode) {
          focusData.focusMode = true;
          saveFocusData();
          applyFocusState();
        }
        startFocusTimer('focus');
      })
    ]);

    const timerSettings = el('div', {}, [
      focusNumberRow('Focus Length', 'timerMinutes', 5, 180, 'min', 'Default focus-session length.'),
      focusNumberRow('Break Length', 'breakMinutes', 1, 60, 'min', 'Default break-session length.')
    ]);

    container.replaceChildren(
      status,
      el('div', { class: 'dpt-nav-group-title', text: 'Focus Presets' }),
      presets,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Distraction Controls' }),
      options,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Focus Timer' }),
      timerDisplay,
      timerMeta,
      timerButtons,
      timerSettings
    );

    updateFocusTimerUI();
  }

  function installFocusShortcut() {
    document.addEventListener('keydown', event => {
      if (!focusData.shortcutEnabled || !powerToolsActive() || stableSafeModeActive()) return;
      if (!(event.altKey && event.shiftKey && event.key.toLowerCase() === 'f')) return;

      const target = event.target;
      const typing = target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target?.isContentEditable;

      if (typing) return;

      event.preventDefault();
      toggleFocusMode();
    }, true);
  }

  function normalizeNitroCosmeticData(value) {
    const data = value && typeof value === 'object' ? value : {};

    const effects = new Set(['none', 'aurora', 'pulse', 'shimmer']);

    return {
      version: 1,
      enabled: !!data.enabled,
      displayName: String(data.displayName || 'KyleAustin85').slice(0, 80),
      bio: String(data.bio || 'Local Nitro cosmetic preview • Discord PowerTools').slice(0, 190),
      accent1: /^#[0-9a-fA-F]{6}$/.test(String(data.accent1 || ''))
        ? data.accent1
        : '#A855F7',
      accent2: /^#[0-9a-fA-F]{6}$/.test(String(data.accent2 || ''))
        ? data.accent2
        : '#5865F2',
      avatarData: String(data.avatarData || ''),
      bannerData: String(data.bannerData || ''),
      showNitroBadge: data.showNitroBadge !== false,
      avatarRing: data.avatarRing !== false,
      profileGlow: data.profileGlow !== false,
      emojiHover: data.emojiHover !== false,
      stickerHover: data.stickerHover !== false,
      reactionHover: !!data.reactionHover,
      profileEffect: effects.has(data.profileEffect) ? data.profileEffect : 'aurora',
      effectSpeed: Math.max(3, Math.min(20, finiteNumber(data.effectSpeed, 8)))
    };
  }

  function loadNitroCosmeticData() {
    try {
      const stored = readStoredValue(NITRO_COSMETIC_KEY, null);

      return normalizeNitroCosmeticData(stored);
    } catch {
      return normalizeNitroCosmeticData(null);
    }
  }

  function saveNitroCosmeticData() {
    return writeStoredValue(NITRO_COSMETIC_KEY, { ...nitroCosmetic });
  }

  function setNitroCosmeticField(key, value) {
    nitroCosmetic[key] = value;
    nitroCosmetic = normalizeNitroCosmeticData(nitroCosmetic);
    saveNitroCosmeticData();
    applyNitroCosmeticState();
    renderNitroCosmeticPreview();
  }

  function applyNitroCosmeticState() {
    const root = document.documentElement;
    if (!root) return;

    const active = effectiveNitroPreview();

    root.setAttribute('data-dpt-nitro-preview', active ? '1' : '0');
    root.setAttribute('data-dpt-nitro-emoji-hover', active && nitroCosmetic.emojiHover ? '1' : '0');
    root.setAttribute('data-dpt-nitro-sticker-hover', active && nitroCosmetic.stickerHover ? '1' : '0');
    root.setAttribute('data-dpt-nitro-reaction-hover', active && nitroCosmetic.reactionHover ? '1' : '0');

    root.style.setProperty('--dpt-nitro-accent-1', nitroCosmetic.accent1);
    root.style.setProperty('--dpt-nitro-accent-2', nitroCosmetic.accent2);
    root.style.setProperty('--dpt-nitro-effect-speed', `${nitroCosmetic.effectSpeed}s`);
  }

  function nitroToggleRow(label, key, note) {
    const checkbox = el('input', { type: 'checkbox' });
    checkbox.checked = !!nitroCosmetic[key];

    checkbox.addEventListener('change', () => {
      setNitroCosmeticField(key, checkbox.checked);
    });

    const copy = el('div', { class: 'dpt-row-text' }, [
      el('div', { class: 'dpt-row-title', text: label }),
      el('div', { class: 'dpt-row-note', text: note })
    ]);

    const switchWrap = el('label', { class: 'dpt-switch' }, [
      checkbox,
      el('span', { class: 'dpt-slider' })
    ]);

    return el('div', { class: 'dpt-row' }, [copy, switchWrap]);
  }

  function nitroTextField(label, key, maxLength, note, multiline = false) {
    const input = multiline
      ? el('textarea', {
          class: 'dpt-nitro-textarea',
          maxlength: String(maxLength),
          rows: '3'
        })
      : el('input', {
          class: 'dpt-nitro-input',
          type: 'text',
          maxlength: String(maxLength)
        });

    input.value = nitroCosmetic[key];

    input.addEventListener('input', () => {
      nitroCosmetic[key] = input.value.slice(0, maxLength);
      saveNitroCosmeticData();
      renderNitroCosmeticPreview();
    });

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-row-title', text: label }),
      input,
      el('div', { class: 'dpt-row-note', text: note })
    ]);
  }

  function nitroColorField(label, key) {
    const input = el('input', {
      class: 'dpt-nitro-color',
      type: 'color',
      value: nitroCosmetic[key]
    });

    const hex = el('span', {
      class: 'dpt-nitro-color-value',
      text: nitroCosmetic[key].toUpperCase()
    });

    input.addEventListener('input', () => {
      nitroCosmetic[key] = input.value;
      hex.textContent = input.value.toUpperCase();
      saveNitroCosmeticData();
      applyNitroCosmeticState();
      renderNitroCosmeticPreview();
    });

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-control-head' }, [
        el('span', { class: 'dpt-row-title', text: label }),
        el('div', { class: 'dpt-nitro-color-wrap' }, [input, hex])
      ])
    ]);
  }

  function nitroEffectSelect() {
    const select = el('select', { class: 'dpt-select' });

    const options = [
      ['none', 'None'],
      ['aurora', 'Aurora'],
      ['pulse', 'Pulse'],
      ['shimmer', 'Shimmer']
    ];

    for (const [value, label] of options) {
      const option = el('option', { value, text: label });
      if (nitroCosmetic.profileEffect === value) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener('change', () => {
      setNitroCosmeticField('profileEffect', select.value);
    });

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-control-head' }, [
        el('span', { class: 'dpt-row-title', text: 'Profile Effect' }),
        select
      ]),
      el('div', {
        class: 'dpt-row-note',
        text: 'Local animation used only in the PowerTools profile preview.'
      })
    ]);
  }

  function nitroEffectSpeedRow() {
    const input = el('input', {
      class: 'dpt-range',
      type: 'range',
      min: '3',
      max: '20',
      step: '1',
      value: String(nitroCosmetic.effectSpeed)
    });

    const value = el('span', {
      class: 'dpt-range-value',
      text: `${nitroCosmetic.effectSpeed}s`
    });

    input.addEventListener('input', () => {
      nitroCosmetic.effectSpeed = Number(input.value);
      value.textContent = `${nitroCosmetic.effectSpeed}s`;
      saveNitroCosmeticData();
      applyNitroCosmeticState();
      renderNitroCosmeticPreview();
    });

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-control-head' }, [
        el('span', { class: 'dpt-row-title', text: 'Effect Speed' }),
        value
      ]),
      input
    ]);
  }

  function chooseNitroLocalImage(kind) {
    const input = el('input', {
      type: 'file',
      accept: 'image/png,image/jpeg,image/webp,image/gif'
    });

    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;

      const maxBytes = 2 * 1024 * 1024;
      if (file.size > maxBytes) {
        toast('Image must be 2 MB or smaller');
        return;
      }

      const reader = new FileReader();

      reader.addEventListener('load', () => {
        const dataUrl = String(reader.result || '');
        if (!dataUrl.startsWith('data:image/')) {
          toast('Unsupported image');
          return;
        }

        if (kind === 'avatar') nitroCosmetic.avatarData = dataUrl;
        if (kind === 'banner') nitroCosmetic.bannerData = dataUrl;

        saveNitroCosmeticData();
        renderNitroCosmeticPreview();
        toast(`${kind === 'avatar' ? 'Avatar' : 'Banner'} preview loaded`);
      });

      reader.readAsDataURL(file);
    });

    input.click();
  }

  function clearNitroLocalImage(kind) {
    if (kind === 'avatar') nitroCosmetic.avatarData = '';
    if (kind === 'banner') nitroCosmetic.bannerData = '';

    saveNitroCosmeticData();
    renderNitroCosmeticPreview();
    toast(`${kind === 'avatar' ? 'Avatar' : 'Banner'} preview cleared`);
  }

  function resetNitroCosmeticPreview() {
    nitroCosmetic = normalizeNitroCosmeticData({
      enabled: false,
      displayName: 'KyleAustin85',
      bio: 'Local Nitro cosmetic preview • Discord PowerTools',
      accent1: '#A855F7',
      accent2: '#5865F2',
      avatarData: '',
      bannerData: '',
      showNitroBadge: true,
      avatarRing: true,
      profileGlow: true,
      emojiHover: true,
      stickerHover: true,
      reactionHover: false,
      profileEffect: 'aurora',
      effectSpeed: 8
    });

    saveNitroCosmeticData();
    applyNitroCosmeticState();
    renderNitroCosmeticPreview();
    toast('Nitro Cosmetic Preview reset');
  }

  function nitroAvatarSource() {
    return nitroCosmetic.avatarData || POWERTOOLS_ICON;
  }

  function buildNitroProfileCard() {
    const card = el('div', {
      class: [
        'dpt-nitro-card',
        nitroCosmetic.profileGlow ? 'glow' : '',
        nitroCosmetic.profileEffect !== 'none'
          ? `effect-${nitroCosmetic.profileEffect}`
          : ''
      ].filter(Boolean).join(' ')
    });

    card.style.setProperty('--preview-a1', nitroCosmetic.accent1);
    card.style.setProperty('--preview-a2', nitroCosmetic.accent2);
    card.style.setProperty('--preview-speed', `${nitroCosmetic.effectSpeed}s`);

    const banner = el('div', { class: 'dpt-nitro-banner' });
    if (nitroCosmetic.bannerData) {
      banner.style.backgroundImage = `url("${nitroCosmetic.bannerData.replace(/"/g, '%22')}")`;
    }

    const avatarWrap = el('div', {
      class: `dpt-nitro-avatar-wrap${nitroCosmetic.avatarRing ? ' ring' : ''}`
    }, [
      el('img', {
        class: 'dpt-nitro-avatar',
        src: nitroAvatarSource(),
        alt: ''
      })
    ]);

    const badges = el('div', { class: 'dpt-nitro-badges' }, [
      el('span', { class: 'dpt-local-only-pill', text: 'LOCAL PREVIEW' }),
      ...(nitroCosmetic.showNitroBadge
        ? [el('span', {
            class: 'dpt-nitro-badge',
            title: 'Local cosmetic preview only',
            text: '◆ NITRO'
          })]
        : [])
    ]);

    const body = el('div', { class: 'dpt-nitro-body' }, [
      badges,
      el('div', {
        class: 'dpt-nitro-name',
        text: nitroCosmetic.displayName || 'KyleAustin85'
      }),
      el('div', {
        class: 'dpt-nitro-bio',
        text: nitroCosmetic.bio || 'Local Nitro cosmetic preview'
      }),
      el('div', { class: 'dpt-nitro-demo-row' }, [
        el('span', { class: 'dpt-nitro-demo-chip', text: 'Profile Effect' }),
        el('span', { class: 'dpt-nitro-demo-chip', text: 'Avatar Ring' }),
        el('span', { class: 'dpt-nitro-demo-chip', text: 'Gradient Accent' })
      ])
    ]);

    card.append(banner, avatarWrap, body);
    return card;
  }

  function renderNitroCosmeticPreview() {
    const container = panel?.querySelector('[data-nitro-cosmetic-preview]');
    if (!container) return;

    const status = el('div', { class: 'dpt-nitro-status' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-nitro-status-title',
          text: `Nitro Cosmetic Preview ${nitroCosmetic.enabled ? 'ON' : 'OFF'}`
        }),
        el('div', {
          class: 'dpt-nitro-status-sub',
          text: 'Local-only. This does not grant or spoof Discord server-side Nitro entitlements.'
        })
      ]),
      el('span', {
        class: `dpt-focus-pill${nitroCosmetic.enabled ? ' active' : ''}`,
        text: nitroCosmetic.enabled ? 'LOCAL ON' : 'OFF'
      })
    ]);

    const master = nitroToggleRow(
      'Enable Cosmetic Preview',
      'enabled',
      'Enables local emoji/sticker/reaction cosmetic enhancements. Profile preview remains available for editing.'
    );

    const profileCard = buildNitroProfileCard();

    const imageButtons = el('div', { class: 'dpt-grid dpt-nitro-image-actions' }, [
      button('Load Avatar Image', () => chooseNitroLocalImage('avatar')),
      button('Clear Avatar', () => clearNitroLocalImage('avatar'), true),
      button('Load Banner Image', () => chooseNitroLocalImage('banner')),
      button('Clear Banner', () => clearNitroLocalImage('banner'), true),
      button('Use Purple Dragon Avatar', () => {
        nitroCosmetic.avatarData = POWERTOOLS_ICON;
        saveNitroCosmeticData();
        renderNitroCosmeticPreview();
        toast('Purple Dragon avatar applied');
      }),
      button('Reset Preview', resetNitroCosmeticPreview, true)
    ]);

    const cosmetics = el('div', {}, [
      nitroToggleRow(
        'Nitro Badge Preview',
        'showNitroBadge',
        'Shows a clearly local Nitro-style badge inside the PowerTools preview card only.'
      ),
      nitroToggleRow(
        'Animated Avatar Ring',
        'avatarRing',
        'Adds a local animated gradient ring around the preview avatar.'
      ),
      nitroToggleRow(
        'Profile Glow',
        'profileGlow',
        'Adds a local accent glow around the preview profile card.'
      ),
      nitroToggleRow(
        'Emoji Hover+',
        'emojiHover',
        'Locally enlarges message emoji while you hover over them.'
      ),
      nitroToggleRow(
        'Sticker Hover+',
        'stickerHover',
        'Locally enlarges Discord stickers while you hover over them.'
      ),
      nitroToggleRow(
        'Reaction Hover+',
        'reactionHover',
        'Adds a small local scale effect to reaction buttons while hovering.'
      )
    ]);

    const backupButtons = el('div', { class: 'dpt-grid dpt-nitro-backup-actions' }, [
      button('Copy Preview Config', () => copyText(JSON.stringify({
        ...nitroCosmetic,
        avatarData: nitroCosmetic.avatarData ? '[local image data omitted]' : '',
        bannerData: nitroCosmetic.bannerData ? '[local image data omitted]' : ''
      }, null, 2))),
      button('Copy Local Status', () => copyText(
        'Discord PowerTools Nitro Cosmetic Preview: LOCAL-ONLY. No Discord Nitro entitlement is granted or modified.'
      ))
    ]);

    container.replaceChildren(
      status,
      master,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Profile Preview' }),
      profileCard,
      imageButtons,
      nitroTextField(
        'Display Name',
        'displayName',
        80,
        'Used only inside the local PowerTools preview card.'
      ),
      nitroTextField(
        'Bio',
        'bio',
        190,
        'Local preview bio.',
        true
      ),
      nitroColorField('Primary Accent', 'accent1'),
      nitroColorField('Secondary Accent', 'accent2'),
      nitroEffectSelect(),
      nitroEffectSpeedRow(),
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Local Cosmetic Enhancements' }),
      cosmetics,
      backupButtons
    );
  }

  function validClockTime(value) {
    const match = String(value || '').match(/^(\d{2}):(\d{2})$/);
    if (!match) return false;

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
  }

  function normalizeNotificationData(value) {
    const data = value && typeof value === 'object' ? value : {};

    return {
      version: 2,
      enabled: !!data.enabled,
      hideMentionBadges: data.hideMentionBadges !== false,
      hideUnreadDots: data.hideUnreadDots !== false,
      softenNotificationBadges: !!data.softenNotificationBadges,
      cleanTitleCount: data.cleanTitleCount !== false,
      muteMediaElements: !!data.muteMediaElements,
      focusSync: data.focusSync !== false,
      snoozeUntil: Math.max(0, finiteNumber(data.snoozeUntil, 0)),
      quietHoursEnabled: !!data.quietHoursEnabled,
      quietStart: validClockTime(data.quietStart) ? data.quietStart : '22:00',
      quietEnd: validClockTime(data.quietEnd) ? data.quietEnd : '08:00',
      snapshotLimit: Math.max(5, Math.min(50, finiteNumber(data.snapshotLimit, 20)))
    };
  }

  function loadNotificationData() {
    try {
      const stored = readStoredValue(NOTIFICATION_DATA_KEY, null);

      return normalizeNotificationData(stored);
    } catch {
      return normalizeNotificationData(null);
    }
  }

  function saveNotificationData() {
    return writeStoredValue(NOTIFICATION_DATA_KEY, { ...notificationData });
  }

  function setNotificationField(key, value) {
    notificationData[key] = value;
    notificationData = normalizeNotificationData(notificationData);
    saveNotificationData();
    applyNotificationControlState();
    renderNotificationControl();
  }

  function parseTimeToMinutes(value) {
    const match = String(value || '').match(/^(\d{2}):(\d{2})$/);
    if (!match) return 0;

    const hour = Math.max(0, Math.min(23, Number(match[1])));
    const minute = Math.max(0, Math.min(59, Number(match[2])));
    return hour * 60 + minute;
  }

  function isQuietHoursActive(now = new Date()) {
    if (!notificationData.quietHoursEnabled) return false;

    const current = now.getHours() * 60 + now.getMinutes();
    const start = parseTimeToMinutes(notificationData.quietStart);
    const end = parseTimeToMinutes(notificationData.quietEnd);

    if (start === end) return true;

    if (start < end) {
      return current >= start && current < end;
    }

    // Overnight window (e.g. 22:00 -> 08:00)
    return current >= start || current < end;
  }

  function isNotificationSnoozed() {
    return Number(notificationData.snoozeUntil || 0) > Date.now();
  }

  function isLocalQuietModeActive() {
    if (!effectiveNotificationControl()) return false;

    if (isNotificationSnoozed()) return true;
    if (isQuietHoursActive()) return true;
    if (notificationData.focusSync && effectiveFocusMode()) return true;

    return false;
  }

  function notificationModeReason() {
    if (!powerToolsActive()) return 'PowerTools master switch is off';
    if (!notificationData.enabled) return 'Notification Control is off';

    if (isNotificationSnoozed()) {
      return `Snoozed until ${new Date(notificationData.snoozeUntil).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    }

    if (isQuietHoursActive()) {
      return `Quiet Hours ${notificationData.quietStart}–${notificationData.quietEnd}`;
    }

    if (notificationData.focusSync && effectiveFocusMode()) {
      return 'Synced with Focus Mode';
    }

    return 'Visual controls active';
  }

  function cleanDiscordTitle(title) {
    return String(title || '').replace(/^\(\d+\)\s*/, '');
  }

  function captureRawDiscordTitle() {
    const current = String(document.title || '');
    if (!current) return;

    if (/^\(\d+\)\s*/.test(current)) {
      lastRawDocumentTitle = current;
      return;
    }

    if (!effectiveNotificationControl() || !notificationData.cleanTitleCount) {
      lastRawDocumentTitle = current;
      return;
    }

    if (cleanDiscordTitle(lastRawDocumentTitle) !== current) {
      lastRawDocumentTitle = current;
    }
  }

  function restoreRawDiscordTitleIfSafe() {
    const raw = String(lastRawDocumentTitle || '');
    const current = String(document.title || '');

    if (!raw || raw === current) return;

    if (cleanDiscordTitle(raw) === current) {
      document.title = raw;
    }
  }

  function restoreNotificationMutedMedia() {
    for (const media of [...notificationMutedMedia]) {
      notificationMutedMedia.delete(media);
      if (!(media instanceof HTMLMediaElement)) continue;

      const previous = notificationPreviousMuteState.get(media);
      notificationPreviousMuteState.delete(media);

      try {
        if (media.isConnected && typeof previous === 'boolean') {
          media.muted = previous;
        }
      } catch {}
    }
  }

  function muteVisibleDiscordMediaElements() {
    const shouldMute = effectiveNotificationControl()
      && notificationData.muteMediaElements
      && !stableSafeModeActive();

    if (!shouldMute) {
      restoreNotificationMutedMedia();
      return;
    }

    document.querySelectorAll('audio,video').forEach(media => {
      try {
        if (!(media instanceof HTMLMediaElement)) return;

        if (!media.muted && !notificationPreviousMuteState.has(media)) {
          notificationPreviousMuteState.set(media, false);
          notificationMutedMedia.add(media);
        }

        media.muted = true;
      } catch {}
    });
  }

  function applyNotificationControlState() {
    const root = document.documentElement;
    if (!root) return;

    captureRawDiscordTitle();

    const active = effectiveNotificationControl();
    const quiet = active && isLocalQuietModeActive();

    root.setAttribute('data-dpt-notification-control', active ? '1' : '0');
    root.setAttribute('data-dpt-notification-quiet', quiet ? '1' : '0');
    root.setAttribute(
      'data-dpt-hide-mentions',
      active && (quiet || notificationData.hideMentionBadges) ? '1' : '0'
    );
    root.setAttribute(
      'data-dpt-hide-unread',
      active && (quiet || notificationData.hideUnreadDots) ? '1' : '0'
    );
    root.setAttribute(
      'data-dpt-soften-badges',
      active && !quiet && notificationData.softenNotificationBadges ? '1' : '0'
    );

    if (active && notificationData.cleanTitleCount) {
      const cleaned = cleanDiscordTitle(document.title);
      if (document.title !== cleaned) document.title = cleaned;
    } else {
      restoreRawDiscordTitleIfSafe();
    }

    muteVisibleDiscordMediaElements();
    updateNotificationBadge();
  }

  function notificationToggleRow(label, key, note) {
    const checkbox = el('input', { type: 'checkbox' });
    checkbox.checked = !!notificationData[key];

    checkbox.addEventListener('change', () => {
      setNotificationField(key, checkbox.checked);
    });

    const copy = el('div', { class: 'dpt-row-text' }, [
      el('div', { class: 'dpt-row-title', text: label }),
      el('div', { class: 'dpt-row-note', text: note })
    ]);

    const switchWrap = el('label', { class: 'dpt-switch' }, [
      checkbox,
      el('span', { class: 'dpt-slider' })
    ]);

    return el('div', { class: 'dpt-row' }, [copy, switchWrap]);
  }

  function setNotificationSnooze(minutes) {
    const mins = Math.max(0, Number(minutes || 0));

    notificationData.enabled = true;
    notificationData.snoozeUntil = mins
      ? Date.now() + mins * 60 * 1000
      : 0;

    saveNotificationData();
    applyNotificationControlState();
    renderNotificationControl();

    toast(mins ? `Notifications visually snoozed for ${mins} min` : 'Notification snooze cleared');
  }

  function notificationTimeRow(label, key, note) {
    const input = el('input', {
      class: 'dpt-notification-time',
      type: 'time',
      value: notificationData[key]
    });

    input.addEventListener('change', () => {
      if (/^\d{2}:\d{2}$/.test(input.value)) {
        setNotificationField(key, input.value);
      }
    });

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-control-head' }, [
        el('span', { class: 'dpt-row-title', text: label }),
        input
      ]),
      el('div', { class: 'dpt-row-note', text: note })
    ]);
  }

  function parseTitleNotificationCount() {
    const match = String(lastRawDocumentTitle || document.title || '')
      .match(/^\((\d+)\)\s*/);

    return match ? Number(match[1]) : 0;
  }

  function captureNotificationSnapshot() {
    const items = [];
    const seen = new Set();

    const add = (kind, text, element) => {
      const label = cleanLabel(text);
      if (!label) return;

      const key = `${kind}:${label}`;
      if (seen.has(key)) return;
      seen.add(key);

      items.push({
        kind,
        label,
        href: element?.closest?.('a[href]')?.href || '',
        capturedAt: Date.now()
      });
    };

    const semanticQueries = [
      ['Mention', '[aria-label*="mention" i]'],
      ['Unread', '[aria-label*="unread" i]'],
      ['Notification', '[aria-label*="notification" i]']
    ];

    for (const [kind, selector] of semanticQueries) {
      document.querySelectorAll(selector).forEach(node => {
        const text =
          node.getAttribute('aria-label')
          || node.getAttribute('title')
          || node.textContent;

        add(kind, text, node);
      });
    }

    return items.slice(0, notificationData.snapshotLimit);
  }

  function notificationSnapshotItem(item) {
    const open = button('Open', () => {
      if (!item.href) return toast('No local link available');

      try {
        const url = new URL(item.href, location.origin);
        if (url.origin === location.origin && url.pathname.startsWith('/channels/')) {
          navigateToDiscordPath(url.pathname);
        } else {
          window.open(url.href, '_blank', 'noopener,noreferrer');
        }
      } catch {
        toast('Could not open item');
      }
    });
    open.classList.add('dpt-nav-mini');
    open.disabled = !item.href;

    const copy = button('Copy', () => copyText(item.label));
    copy.classList.add('dpt-nav-mini');

    return el('div', { class: 'dpt-notification-item' }, [
      el('div', { class: 'dpt-notification-item-copy' }, [
        el('div', { class: 'dpt-notification-item-kind', text: item.kind }),
        el('div', { class: 'dpt-notification-item-label', text: item.label })
      ]),
      el('div', { class: 'dpt-nav-actions' }, [open, copy])
    ]);
  }

  function ensureNotificationBadge() {
    if (!document.body) return null;

    let badge = document.getElementById('dpt-notification-badge');

    if (!badge) {
      badge = el('button', {
        id: 'dpt-notification-badge',
        type: 'button',
        title: 'Discord PowerTools Notification Control'
      });

      badge.addEventListener('click', () => {
        if (!panel) return;
        panel.hidden = false;
        setDashboardTab('notifications', { scroll: false, instant: true });
        renderNotificationControl();
      });

      document.body.appendChild(badge);
    }

    return badge;
  }

  function updateNotificationBadge() {
    const badge = ensureNotificationBadge();
    if (!badge) return;

    const active = effectiveNotificationControl();
    const quiet = active && isLocalQuietModeActive();
    const show = active && (
      quiet
      || notificationData.hideMentionBadges
      || notificationData.hideUnreadDots
    );

    badge.hidden = !show;
    if (!show) return;

    if (quiet) {
      badge.textContent = isNotificationSnoozed()
        ? 'NOTIFICATIONS SNOOZED'
        : 'QUIET MODE';
      badge.setAttribute('data-quiet', '1');
    } else {
      badge.textContent = 'NOTIFICATION CONTROL';
      badge.setAttribute('data-quiet', '0');
    }
  }

  function notificationTicker() {
    captureRawDiscordTitle();

    if (notificationData.snoozeUntil && notificationData.snoozeUntil <= Date.now()) {
      notificationData.snoozeUntil = 0;
      saveNotificationData();
    }

    applyNotificationControlState();

    if (panel && !panel.hidden && dashboardActiveTab === 'notifications') {
      const status = panel.querySelector('[data-notification-status-line]');
      if (status) status.textContent = notificationModeReason();

      const count = panel.querySelector('[data-notification-title-count]');
      if (count) count.textContent = String(parseTitleNotificationCount());
    }
  }

  function startNotificationTicker() {
    clearTimeout(notificationTickerHandle);

    const schedule = delay => {
      clearTimeout(notificationTickerHandle);
      notificationTickerHandle = setTimeout(() => {
        notificationTicker();

        const active = effectiveNotificationControl();
        const fast = active && (
          notificationData.cleanTitleCount
          || notificationData.muteMediaElements
          || isNotificationSnoozed()
          || notificationData.quietHoursEnabled
        );

        schedule(fast ? 2000 : 15000);
      }, delay);
    };

    notificationTicker();
    schedule(effectiveNotificationControl() ? 2000 : 15000);
  }

  function resetNotificationControl() {
    notificationData = normalizeNotificationData({
      enabled: false,
      hideMentionBadges: true,
      hideUnreadDots: true,
      softenNotificationBadges: false,
      cleanTitleCount: true,
      muteMediaElements: false,
      focusSync: true,
      snoozeUntil: 0,
      quietHoursEnabled: false,
      quietStart: '22:00',
      quietEnd: '08:00',
      snapshotLimit: 20
    });

    saveNotificationData();
    applyNotificationControlState();
    renderNotificationControl();
    toast('Notification Control reset');
  }

  function renderNotificationControl() {
    const container = panel?.querySelector('[data-notification-control]');
    if (!container) return;

    const quiet = isLocalQuietModeActive();
    const titleCount = parseTitleNotificationCount();

    const status = el('div', { class: 'dpt-notification-status' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-notification-status-title',
          text: `Notification Control ${notificationData.enabled ? 'ON' : 'OFF'}`
        }),
        el('div', {
          class: 'dpt-notification-status-sub',
          'data-notification-status-line': '1',
          text: notificationModeReason()
        })
      ]),
      el('span', {
        class: `dpt-focus-pill${quiet ? ' active' : ''}`,
        text: quiet ? 'QUIET' : (notificationData.enabled ? 'ACTIVE' : 'OFF')
      })
    ]);

    const master = notificationToggleRow(
      'Enable Notification Control',
      'enabled',
      'Local visual controls only. Discord server/account notification settings are not changed.'
    );

    const controls = el('div', {}, [
      notificationToggleRow(
        'Hide Mention Badges',
        'hideMentionBadges',
        'Visually hides mention-count badges while Notification Control is enabled.'
      ),
      notificationToggleRow(
        'Hide Unread Indicators',
        'hideUnreadDots',
        'Visually hides common unread markers. It does not mark anything as read.'
      ),
      notificationToggleRow(
        'Soften Remaining Badges',
        'softenNotificationBadges',
        'Reduces opacity of notification-style badges that remain visible.'
      ),
      notificationToggleRow(
        'Clean Browser Title Count',
        'cleanTitleCount',
        'Removes leading counts such as “(3)” from the Discord tab title locally.'
      ),
      notificationToggleRow(
        'Mute Visible Media Elements',
        'muteMediaElements',
        'Locally mutes currently mounted audio/video elements. This may not cover Discord sounds implemented through WebAudio.'
      ),
      notificationToggleRow(
        'Sync Quiet Mode with Focus',
        'focusSync',
        'Automatically enables the visual quiet state whenever PowerTools Focus Mode is active.'
      )
    ]);

    const snooze = el('div', { class: 'dpt-grid dpt-notification-snooze' }, [
      button('Snooze 15m', () => setNotificationSnooze(15)),
      button('Snooze 30m', () => setNotificationSnooze(30)),
      button('Snooze 1h', () => setNotificationSnooze(60)),
      button('Snooze 2h', () => setNotificationSnooze(120)),
      button('Clear Snooze', () => setNotificationSnooze(0), true),
      button('Enable Quiet Now', () => {
        notificationData.enabled = true;
        notificationData.snoozeUntil = Date.now() + 8 * 60 * 60 * 1000;
        saveNotificationData();
        applyNotificationControlState();
        renderNotificationControl();
        toast('Quiet Mode enabled for 8 hours');
      })
    ]);

    const quietHours = el('div', {}, [
      notificationToggleRow(
        'Enable Quiet Hours',
        'quietHoursEnabled',
        'Automatically activates the local visual quiet state during the configured time window.'
      ),
      notificationTimeRow(
        'Quiet Hours Start',
        'quietStart',
        'Local browser time.'
      ),
      notificationTimeRow(
        'Quiet Hours End',
        'quietEnd',
        'Overnight ranges such as 22:00 → 08:00 are supported.'
      )
    ]);

    const metrics = el('div', { class: 'dpt-notification-metrics' }, [
      el('div', { class: 'dpt-notification-metric' }, [
        el('b', {
          'data-notification-title-count': '1',
          text: String(titleCount)
        }),
        el('span', { text: 'Title Count' })
      ]),
      el('div', { class: 'dpt-notification-metric' }, [
        el('b', { text: notificationData.hideMentionBadges ? 'Hidden' : 'Shown' }),
        el('span', { text: 'Mentions' })
      ]),
      el('div', { class: 'dpt-notification-metric' }, [
        el('b', { text: notificationData.hideUnreadDots ? 'Hidden' : 'Shown' }),
        el('span', { text: 'Unread' })
      ])
    ]);

    const snapshot = captureNotificationSnapshot();

    const snapshotList = el('div', { class: 'dpt-notification-list' },
      snapshot.length
        ? snapshot.map(notificationSnapshotItem)
        : [el('div', {
            class: 'dpt-nav-empty',
            text: 'No visible semantic notification items detected.'
          })]
    );

    const tools = el('div', { class: 'dpt-grid dpt-notification-tools' }, [
      button('Copy Snapshot', () => copyText(JSON.stringify(snapshot, null, 2))),
      button('Refresh Snapshot', () => {
        renderNotificationControl();
        toast('Notification snapshot refreshed');
      }),
      button('Copy Control Config', () => copyText(JSON.stringify(notificationData, null, 2))),
      button('Reset Notification Control', resetNotificationControl, true)
    ]);

    container.replaceChildren(
      status,
      master,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Visual Controls' }),
      controls,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Snooze' }),
      snooze,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Quiet Hours' }),
      quietHours,
      el('div', { class: 'dpt-nav-divider' }),
      metrics,
      el('div', { class: 'dpt-nav-group-title', text: `Visible Notification Snapshot (${snapshot.length})` }),
      snapshotList,
      tools
    );
  }

  function normalizePrivacyData(value) {
    const data = value && typeof value === 'object' ? value : {};

    return {
      version: 1,
      enabled: !!data.enabled,
      stripTrackingParams: data.stripTrackingParams !== false,
      privateExternalOpen: data.privateExternalOpen !== false,
      sanitizeCopiedLinks: data.sanitizeCopiedLinks !== false,
      blockAnalyticsBeacon: !!data.blockAnalyticsBeacon,
      blockAnalyticsFetch: !!data.blockAnalyticsFetch,
      blockErrorReporting: !!data.blockErrorReporting,
      maskInviteQueryParams: data.maskInviteQueryParams !== false,
      hideExternalLinkPreviewOnHover: !!data.hideExternalLinkPreviewOnHover,
      auditLimit: Math.max(10, Math.min(100, finiteNumber(data.auditLimit, 40))),
      blockedCount: Math.max(0, finiteNumber(data.blockedCount, 0)),
      sanitizedCount: Math.max(0, finiteNumber(data.sanitizedCount, 0))
    };
  }

  function loadPrivacyData() {
    try {
      const stored = readStoredValue(PRIVACY_DATA_KEY, null);

      return normalizePrivacyData(stored);
    } catch {
      return normalizePrivacyData(null);
    }
  }

  function savePrivacyData() {
    return writeStoredValue(PRIVACY_DATA_KEY, { ...privacyData });
  }

  function setPrivacyField(key, value) {
    privacyData[key] = value;
    privacyData = normalizePrivacyData(privacyData);
    savePrivacyData();
    applyPrivacyState();
    renderPrivacyTrackingControl();
  }

  function isTrackingParam(name) {
    const key = String(name || '').toLowerCase();

    return (
      key.startsWith('utm_')
      || key === 'fbclid'
      || key === 'gclid'
      || key === 'dclid'
      || key === 'msclkid'
      || key === 'mc_cid'
      || key === 'mc_eid'
      || key === 'ref'
      || key === 'referrer'
      || key === 'source'
      || key === 'campaign'
      || key === 'tracking'
      || key === 'tracking_id'
      || key === 'click_id'
      || key === 'igshid'
      || key === 'si'
    );
  }

  function sanitizeUrl(value, countStat = false, force = false) {
    const original = String(value || '').trim();
    if (!original) return '';

    try {
      const url = new URL(original, location.origin);
      if (!/^https?:$/.test(url.protocol)) return '';

      const before = url.href;
      const active = force || effectivePrivacyControl();

      if (active && privacyData.stripTrackingParams) {
        for (const key of [...url.searchParams.keys()]) {
          if (isTrackingParam(key)) url.searchParams.delete(key);
        }
      }

      if (
        active
        && privacyData.maskInviteQueryParams
        && /(^|\.)discord\.(gg|com)$/i.test(url.hostname)
        && (url.pathname.includes('/invite') || url.hostname.toLowerCase() === 'discord.gg')
      ) {
        url.search = '';
        url.hash = '';
      }

      const after = url.href;

      if (countStat && before !== after) {
        privacyData.sanitizedCount += 1;
        savePrivacyData();
      }

      return after;
    } catch {
      return '';
    }
  }

  function privateOpenUrl(value) {
    const safe = safeHttpUrl(value);
    if (!safe) {
      toast('Blocked unsafe or invalid URL');
      return;
    }

    const privacyActive = effectivePrivacyControl() && privacyData.privateExternalOpen;
    const href = privacyActive
      ? (sanitizeUrl(safe, true, true) || safe)
      : safe;

    try {
      const url = new URL(href, location.origin);

      if (url.origin === location.origin && url.pathname.startsWith('/channels/')) {
        navigateToDiscordPath(url.pathname);
        return;
      }

      window.open(url.href, '_blank', 'noopener,noreferrer');
    } catch {
      toast('Could not open URL');
    }
  }

  function sanitizeTextLinks(text, countStat = false, force = false) {
    const source = String(text || '');
    let changed = false;

    const output = source.replace(
      /https?:\/\/[^\s<>"')\]]+/gi,
      match => {
        const clean = sanitizeUrl(match, false, force);
        if (clean && clean !== match) changed = true;
        return clean || match;
      }
    );

    if (changed && countStat) {
      privacyData.sanitizedCount += 1;
      savePrivacyData();
    }

    return output;
  }

  function copyPrivateText(text) {
    const value = effectivePrivacyControl() && privacyData.sanitizeCopiedLinks
      ? sanitizeTextLinks(text, true, true)
      : String(text || '');

    copyText(value);
  }

  function copyPrivateUrl(url) {
    const value = effectivePrivacyControl() && privacyData.sanitizeCopiedLinks
      ? (sanitizeUrl(url, true, true) || safeHttpUrl(url))
      : safeHttpUrl(url);

    if (!value) {
      toast('Invalid or unsafe URL');
      return;
    }

    copyText(value);
  }

  function isAnalyticsUrl(value) {
    try {
      const url = new URL(typeof value === 'string' || value instanceof URL ? value : value?.url || '', location.origin);
      return /^(?:canary\.|ptb\.)?discord\.com$/.test(url.hostname)
        && /^\/api(?:\/v\d+)?\/science\/?$/.test(url.pathname);
    } catch { return false; }
  }

  function isErrorReportingUrl(value) {
    try {
      const url = new URL(typeof value === 'string' || value instanceof URL ? value : value?.url || '', location.origin);
      return (url.hostname === 'sentry.io' || url.hostname.endsWith('.sentry.io'))
        && /^\/api\/\d+\/(?:envelope|store)\/?$/.test(url.pathname);
    } catch { return false; }
  }

  function shouldBlockPrivacyRequest(value) {
    if (!effectivePrivacyControl() || stableSafeModeActive()) return false;

    if (privacyData.blockAnalyticsFetch && isAnalyticsUrl(value)) return true;
    if (privacyData.blockErrorReporting && isErrorReportingUrl(value)) return true;
    return false;
  }

  function installPrivacyFetchGuard() {
    if (privacyFetchInstalled) return;
    if (typeof window.fetch !== 'function') return;

    privacyFetchInstalled = true;
    privacyOriginalFetch = window.fetch.bind(window);

    window.fetch = function(input, init) {
      if (shouldBlockPrivacyRequest(input)) {
        privacyData.blockedCount += 1;
        savePrivacyData();

        return Promise.resolve(
          new Response(null, {
            status: 204,
            statusText: 'Blocked by Discord PowerTools Privacy Control'
          })
        );
      }

      return privacyOriginalFetch(input, init);
    };
  }

  function installPrivacyBeaconGuard() {
    if (privacyBeaconInstalled) return;
    if (typeof navigator.sendBeacon !== 'function') return;

    privacyBeaconInstalled = true;
    privacyOriginalBeacon = navigator.sendBeacon.bind(navigator);

    try {
      navigator.sendBeacon = function(url, data) {
        const privacyActive = effectivePrivacyControl() && !stableSafeModeActive();

        const blockAnalytics =
          privacyActive
          && privacyData.blockAnalyticsBeacon
          && isAnalyticsUrl(url);

        const blockErrors =
          privacyActive
          && privacyData.blockErrorReporting
          && isErrorReportingUrl(url);

        if (blockAnalytics || blockErrors) {
          privacyData.blockedCount += 1;
          savePrivacyData();
          return true;
        }

        return privacyOriginalBeacon(url, data);
      };
    } catch {}
  }

  function applyPrivacyState() {
    const root = document.documentElement;
    if (!root) return;

    const active = effectivePrivacyControl();

    root.setAttribute('data-dpt-privacy', active ? '1' : '0');
    root.setAttribute(
      'data-dpt-private-hover',
      active && privacyData.hideExternalLinkPreviewOnHover ? '1' : '0'
    );

    installPrivacyFetchGuard();
    installPrivacyBeaconGuard();
    updatePrivacyBadge();
  }

  function privacyToggleRow(label, key, note) {
    const checkbox = el('input', { type: 'checkbox' });
    checkbox.checked = !!privacyData[key];

    checkbox.addEventListener('change', () => {
      setPrivacyField(key, checkbox.checked);
    });

    const copy = el('div', { class: 'dpt-row-text' }, [
      el('div', { class: 'dpt-row-title', text: label }),
      el('div', { class: 'dpt-row-note', text: note })
    ]);

    const switchWrap = el('label', { class: 'dpt-switch' }, [
      checkbox,
      el('span', { class: 'dpt-slider' })
    ]);

    return el('div', { class: 'dpt-row' }, [copy, switchWrap]);
  }

  function currentPagePrivateUrl() {
    return sanitizeUrl(location.href, false, true);
  }

  function selectedMessagePrivateLinks() {
    if (!selectedMessage) return [];

    const urls = [
      selectedMessage.link,
      ...(selectedMessage.links || []),
      ...(selectedMessage.attachments || [])
    ].filter(Boolean);

    return uniqueStrings(
      urls.map(url => sanitizeUrl(url, false, true))
    );
  }

  function privacyAudit() {
    const result = {
      page: {
        original: location.href,
        sanitized: sanitizeUrl(location.href, false, true)
      },
      selectedMessage: {
        available: !!selectedMessage,
        links: selectedMessagePrivateLinks()
      },
      visibleExternalLinks: [],
      counters: {
        blocked: privacyData.blockedCount,
        sanitized: privacyData.sanitizedCount
      }
    };

    const seen = new Set();

    document.querySelectorAll('a[href]').forEach(anchor => {
      if (result.visibleExternalLinks.length >= privacyData.auditLimit) return;

      try {
        const url = new URL(anchor.href, location.origin);
        if (!/^https?:$/.test(url.protocol)) return;
        if (url.origin === location.origin) return;

        const clean = sanitizeUrl(url.href, false, true);
        if (seen.has(clean)) return;
        seen.add(clean);

        result.visibleExternalLinks.push({
          label: cleanLabel(
            anchor.getAttribute('aria-label')
            || anchor.getAttribute('title')
            || anchor.textContent,
            mediaFilename(clean)
          ).slice(0, 120),
          original: url.href,
          sanitized: clean,
          trackingRemoved: clean !== url.href
        });
      } catch {}
    });

    return result;
  }

  function privacyAuditItem(item) {
    const open = button('Private Open', () => privateOpenUrl(item.sanitized));
    open.classList.add('dpt-nav-mini');

    const copy = button('Copy Clean', () => copyPrivateUrl(item.sanitized));
    copy.classList.add('dpt-nav-mini');

    return el('div', { class: 'dpt-privacy-audit-item' }, [
      el('div', { class: 'dpt-privacy-audit-copy' }, [
        el('div', {
          class: 'dpt-privacy-audit-title',
          text: item.label || 'External link'
        }),
        el('div', {
          class: 'dpt-privacy-audit-url',
          text: item.sanitized
        }),
        ...(item.trackingRemoved
          ? [el('span', {
              class: 'dpt-privacy-clean-pill',
              text: 'TRACKING REMOVED'
            })]
          : [])
      ]),
      el('div', { class: 'dpt-nav-actions' }, [open, copy])
    ]);
  }

  function ensurePrivacyBadge() {
    if (!document.body) return null;

    let badge = document.getElementById('dpt-privacy-badge');

    if (!badge) {
      badge = el('button', {
        id: 'dpt-privacy-badge',
        type: 'button',
        title: 'Discord PowerTools Privacy Control'
      });

      badge.addEventListener('click', () => {
        if (!panel) return;
        panel.hidden = false;
        setDashboardTab('privacy', { scroll: false, instant: true });
        renderPrivacyTrackingControl();
      });

      document.body.appendChild(badge);
    }

    return badge;
  }

  function updatePrivacyBadge() {
    const badge = ensurePrivacyBadge();
    if (!badge) return;

    const active = effectivePrivacyControl();
    badge.hidden = !active;
    if (!active) return;

    const safe = stableSafeModeActive();
    badge.textContent = safe
      ? 'PRIVACY • SAFE MODE'
      : `PRIVACY • ${privacyData.blockedCount} BLOCKED`;
  }

  function resetPrivacyControl() {
    privacyData = normalizePrivacyData({
      enabled: false,
      stripTrackingParams: true,
      privateExternalOpen: true,
      sanitizeCopiedLinks: true,
      blockAnalyticsBeacon: false,
      blockAnalyticsFetch: false,
      blockErrorReporting: false,
      maskInviteQueryParams: true,
      hideExternalLinkPreviewOnHover: false,
      auditLimit: 40,
      blockedCount: 0,
      sanitizedCount: 0
    });

    savePrivacyData();
    applyPrivacyState();
    renderPrivacyTrackingControl();
    updatePrivacyBadge();
    toast('Privacy & Tracking Control reset');
  }

  function renderPrivacyTrackingControl() {
    const container = panel?.querySelector('[data-privacy-tracking-control]');
    if (!container) return;

    const audit = privacyAudit();

    const status = el('div', { class: 'dpt-privacy-status' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-privacy-status-title',
          text: `Privacy & Tracking Control ${privacyData.enabled ? 'ON' : 'OFF'}`
        }),
        el('div', {
          class: 'dpt-privacy-status-sub',
          text: privacyData.enabled
            ? 'Local privacy controls are active.'
            : 'Privacy controls are currently disabled.'
        })
      ]),
      el('span', {
        class: `dpt-focus-pill${privacyData.enabled ? ' active' : ''}`,
        text: privacyData.enabled ? 'ACTIVE' : 'OFF'
      })
    ]);

    const master = privacyToggleRow(
      'Enable Privacy Control',
      'enabled',
      'Enables local link sanitizing and any optional privacy guards selected below.'
    );

    const safeControls = el('div', {}, [
      privacyToggleRow(
        'Strip Tracking Parameters',
        'stripTrackingParams',
        'Removes common UTM/click-tracking parameters from copied/opened links.'
      ),
      privacyToggleRow(
        'Sanitize Copied Links',
        'sanitizeCopiedLinks',
        'Applies link sanitizing when using Privacy Control copy tools.'
      ),
      privacyToggleRow(
        'Private External Open',
        'privateExternalOpen',
        'Opens external links with noopener/noreferrer and sanitized query parameters.'
      ),
      privacyToggleRow(
        'Clean Discord Invite Queries',
        'maskInviteQueryParams',
        'Removes query parameters from Discord invite URLs copied/opened through Privacy Control.'
      ),
      privacyToggleRow(
        'Hide External Hover Preview',
        'hideExternalLinkPreviewOnHover',
        'Locally fades common external-link hover decorations where detected.'
      )
    ]);

    const advanced = el('div', {}, [
      privacyToggleRow(
        'Block Analytics Fetch',
        'blockAnalyticsFetch',
        'Advanced: attempts to block Discord science fetch requests in this script context. Manager sandboxing may prevent page-wide blocking. Off by default.'
      ),
      privacyToggleRow(
        'Block Analytics Beacon',
        'blockAnalyticsBeacon',
        'Advanced: attempts to block Discord science beacons in this script context. Manager sandboxing may prevent page-wide blocking. Off by default.'
      ),
      privacyToggleRow(
        'Block Error Reporting',
        'blockErrorReporting',
        'Advanced: attempts to block Sentry ingestion in this script context. Page-wide blocking depends on manager sandboxing. Off by default.'
      )
    ]);

    const quickTools = el('div', { class: 'dpt-grid dpt-privacy-tools' }, [
      button('Copy Clean Page URL', () => copyPrivateUrl(currentPagePrivateUrl())),
      button('Private Open Page URL', () => privateOpenUrl(currentPagePrivateUrl())),
      button('Copy Message Links', () => {
        const links = selectedMessagePrivateLinks();
        if (!links.length) return toast('No selected-message links');
        copyPrivateText(links.join('\n'));
      }),
      button('Copy Privacy Audit', () => copyText(JSON.stringify(privacyAudit(), null, 2))),
      button('Reset Counters', () => {
        privacyData.blockedCount = 0;
        privacyData.sanitizedCount = 0;
        savePrivacyData();
        renderPrivacyTrackingControl();
        updatePrivacyBadge();
        toast('Privacy counters reset');
      }),
      button('Reset Privacy Control', resetPrivacyControl, true)
    ]);

    const metrics = el('div', { class: 'dpt-privacy-metrics' }, [
      el('div', { class: 'dpt-privacy-metric' }, [
        el('b', { text: String(privacyData.blockedCount) }),
        el('span', { text: 'Blocked' })
      ]),
      el('div', { class: 'dpt-privacy-metric' }, [
        el('b', { text: String(privacyData.sanitizedCount) }),
        el('span', { text: 'Sanitized' })
      ]),
      el('div', { class: 'dpt-privacy-metric' }, [
        el('b', { text: String(audit.visibleExternalLinks.length) }),
        el('span', { text: 'Visible Links' })
      ])
    ]);

    const auditList = el('div', { class: 'dpt-privacy-audit-list' },
      audit.visibleExternalLinks.length
        ? audit.visibleExternalLinks.map(privacyAuditItem)
        : [el('div', {
            class: 'dpt-nav-empty',
            text: 'No visible external links detected.'
          })]
    );

    container.replaceChildren(
      status,
      master,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Safe Link Controls' }),
      safeControls,
      quickTools,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Advanced Tracking Guards' }),
      advanced,
      el('div', {
        class: 'dpt-privacy-warning',
        text: 'Advanced blocking is optional and off by default. If Discord behaves unexpectedly, turn those options off.'
      }),
      el('div', { class: 'dpt-nav-divider' }),
      metrics,
      el('div', {
        class: 'dpt-nav-group-title',
        text: `Privacy Audit (${audit.visibleExternalLinks.length})`
      }),
      auditList
    );

    updatePrivacyBadge();
  }

  function normalizePerformance2Data(value) {
    const data = value && typeof value === 'object' ? value : {};

    const profiles = new Set(['balanced', 'smooth', 'battery']);

    return {
      version: 1,
      enabled: data.enabled !== false,
      profile: profiles.has(data.profile) ? data.profile : 'balanced',
      backgroundEfficiency: data.backgroundEfficiency !== false,
      lazyMediaHints: data.lazyMediaHints !== false,
      asyncImageDecode: data.asyncImageDecode !== false,
      reduceOffscreenPaint: data.reduceOffscreenPaint !== false,
      compactHeavyEffects: data.compactHeavyEffects !== false,
      adaptiveMotion: data.adaptiveMotion !== false,
      diagnosticObserver: data.diagnosticObserver !== false,
      showPerformanceBadge: !!data.showPerformanceBadge,
      autoTuneOnHighLoad: !!data.autoTuneOnHighLoad,
      highLoadDomThreshold: Math.max(1500, Math.min(12000, finiteNumber(data.highLoadDomThreshold, 5500))),
      highLoadMutationRate: Math.max(50, Math.min(3000, finiteNumber(data.highLoadMutationRate, 700))),
      autoTuneActive: !!data.autoTuneActive,
      imageOptimizedCount: Math.max(0, finiteNumber(data.imageOptimizedCount, 0)),
      tuneCount: Math.max(0, finiteNumber(data.tuneCount, 0))
    };
  }

  function loadPerformance2Data() {
    try {
      const stored = readStoredValue(PERFORMANCE2_DATA_KEY, null);

      return normalizePerformance2Data(stored);
    } catch {
      return normalizePerformance2Data(null);
    }
  }

  function savePerformance2Data() {
    return writeStoredValue(PERFORMANCE2_DATA_KEY, { ...performance2 });
  }

  function setPerformance2Field(key, value) {
    performance2[key] = value;
    performance2 = normalizePerformance2Data(performance2);
    savePerformance2Data();
    applyPerformance2State();
    renderPerformance2Center();
  }

  function performance2ProfileSettings(profile = performance2.profile) {
    const presets = {
      balanced: {
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: true,
        compactHeavyEffects: true,
        adaptiveMotion: true
      },
      smooth: {
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: false,
        compactHeavyEffects: false,
        adaptiveMotion: false
      },
      battery: {
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: true,
        compactHeavyEffects: true,
        adaptiveMotion: true
      }
    };

    return presets[profile] || presets.balanced;
  }

  function applyPerformance2Profile(profile) {
    const settings = performance2ProfileSettings(profile);

    performance2 = normalizePerformance2Data({
      ...performance2,
      profile,
      ...settings
    });

    savePerformance2Data();
    applyPerformance2State();
    optimizeVisibleMediaHints(true);
    renderPerformance2Center();

    const names = {
      balanced: 'Balanced',
      smooth: 'Smooth',
      battery: 'Battery Saver'
    };

    toast(`${names[profile] || 'Performance'} profile applied`);
  }

  function performance2ToggleRow(label, key, note) {
    const checkbox = el('input', { type: 'checkbox' });
    checkbox.checked = !!performance2[key];

    checkbox.addEventListener('change', () => {
      setPerformance2Field(key, checkbox.checked);
    });

    const copy = el('div', { class: 'dpt-row-text' }, [
      el('div', { class: 'dpt-row-title', text: label }),
      el('div', { class: 'dpt-row-note', text: note })
    ]);

    const switchWrap = el('label', { class: 'dpt-switch' }, [
      checkbox,
      el('span', { class: 'dpt-slider' })
    ]);

    return el('div', { class: 'dpt-row' }, [copy, switchWrap]);
  }

function applyPerformance2State() {
    const root = document.documentElement;
    if (!root) return;

    const active = effectivePerformance2();
    const strongEffects = active && !stableSafeModeActive();

    root.setAttribute('data-dpt-perf2', active ? '1' : '0');
    root.setAttribute('data-dpt-perf2-profile', performance2.profile);
    root.setAttribute(
      'data-dpt-perf2-offscreen',
      strongEffects && performance2.reduceOffscreenPaint ? '1' : '0'
    );
    root.setAttribute(
      'data-dpt-perf2-effects',
      strongEffects && performance2.compactHeavyEffects ? '1' : '0'
    );
    root.setAttribute(
      'data-dpt-perf2-motion',
      strongEffects && performance2.adaptiveMotion ? '1' : '0'
    );
    root.setAttribute(
      'data-dpt-perf2-auto',
      strongEffects && performance2.autoTuneActive ? '1' : '0'
    );

    startObserver();
    updatePerformance2Badge();
  }

  function optimizeVisibleMediaHints(force = false) {
    if (!effectivePerformance2() || !force) return;
    applyMediaHints(document);
  }

  function installPerformance2LongTaskObserver() {
    if (perf2LongTaskObserver) return;
    if (!performance2.diagnosticObserver) return;
    if (typeof PerformanceObserver !== 'function') return;

    try {
      const supported = PerformanceObserver.supportedEntryTypes || [];
      if (!supported.includes('longtask')) return;

      perf2LongTaskObserver = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          perf2LongTaskCount += 1;
          perf2LongTaskTime += Number(entry.duration || 0);
        }
      });

      perf2LongTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch {}
  }

  function disconnectPerformance2LongTaskObserver() {
    if (!perf2LongTaskObserver) return;

    try {
      perf2LongTaskObserver.disconnect();
    } catch {}

    perf2LongTaskObserver = null;
  }

  function installPerformance2MutationCounter() {
    // Performance+ 2.0 reuses the original PowerTools subtree observer.
    // This avoids running two MutationObservers across Discord's full DOM.
    startObserver();
  }

  function samplePerformance2MutationRate() {
    const now = performance.now();
    const elapsed = Math.max(250, now - perf2LastMutationSampleAt);
    const delta = perf2MutationCount - perf2LastMutationCount;

    perf2MutationRate = Math.round(delta * (1000 / elapsed));

    perf2LastMutationCount = perf2MutationCount;
    perf2LastMutationSampleAt = now;
  }

  function currentPerformance2DomNodes(force = false) {
    const now = performance.now();
    const maxAge = document.hidden ? 30000 : 15000;

    if (
      force
      || !perf2CachedDomNodes
      || (perf2DomDirty && now - perf2LastDomRefreshAt >= maxAge)
      || now - perf2LastDomRefreshAt >= maxAge * 2
    ) {
      perf2CachedDomNodes = document.getElementsByTagName('*').length;
      perf2LastDomRefreshAt = now;
      perf2DomDirty = false;
    }

    return perf2CachedDomNodes;
  }

  function samplePerformance2LongTaskRate() {
    const now = performance.now();
    const elapsed = Math.max(250, now - perf2LastLongTaskSampleAt);
    const delta = Math.max(0, perf2LongTaskCount - perf2LastLongTaskCount);

    perf2LongTaskRate = Number((delta * (1000 / elapsed)).toFixed(2));
    perf2LastLongTaskCount = perf2LongTaskCount;
    perf2LastLongTaskSampleAt = now;
  }

  function calculatePerformance2Pressure(
    domNodes = currentPerformance2DomNodes(false),
    mutationRate = perf2MutationRate,
    longTaskRate = perf2LongTaskRate
  ) {
    const domThreshold = Math.max(1, Number(performance2.highLoadDomThreshold || 5500));
    const mutationThreshold = Math.max(1, Number(performance2.highLoadMutationRate || 700));

    // DOM size is intentionally only a minority signal. Discord can have a
    // large but idle DOM without being under real CPU/rendering pressure.
    const domRatio = Math.min(2, Number(domNodes || 0) / domThreshold);
    const mutationRatio = Math.min(1.5, Number(mutationRate || 0) / mutationThreshold);

    // Roughly 1.5 browser long tasks/sec is treated as heavy main-thread pressure.
    const longTaskRatio = Math.min(1.5, Number(longTaskRate || 0) / 1.5);

    const weighted =
      (domRatio * 0.20)
      + (mutationRatio * 0.60)
      + (longTaskRatio * 0.20);

    return Math.max(0, Math.min(100, Math.round(weighted * 100)));
  }

  function currentMemoryMB() {
    try {
      const memory = performance.memory;
      if (!memory?.usedJSHeapSize) return 0;

      perf2LastMemoryMB = memory.usedJSHeapSize / (1024 * 1024);
      return perf2LastMemoryMB;
    } catch {
      return perf2LastMemoryMB;
    }
  }

  function performance2Snapshot(forceDom = false) {
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    const domNodes = currentPerformance2DomNodes(forceDom);
    const pressureScore = calculatePerformance2Pressure(
      domNodes,
      perf2MutationRate,
      perf2LongTaskRate
    );

    perf2PressureScore = pressureScore;

    return {
      version: VERSION,
      profile: performance2.profile,
      enabled: performance2.enabled,
      autoTuneActive: performance2.autoTuneActive,
      pressureScore,
      domNodes,
      mutationRatePerSec: perf2MutationRate,
      longTaskRatePerSec: perf2LongTaskRate,
      longTasks: perf2LongTaskCount,
      longTaskTimeMs: Math.round(perf2LongTaskTime),
      memoryMB: Number(currentMemoryMB().toFixed(1)),
      imageHintsApplied: performance2.imageOptimizedCount,
      documentVisibility: document.visibilityState,
      navigation: nav ? {
        domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd || 0),
        loadEventMs: Math.round(nav.loadEventEnd || 0),
        transferSize: Number(nav.transferSize || 0)
      } : null
    };
  }

  function evaluatePerformance2AutoTune() {
    if (!effectivePerformance2() || stableSafeModeActive() || !performance2.autoTuneOnHighLoad) {
      perf2HighPressureSamples = 0;
      perf2LowPressureSamples = 0;

      if (performance2.autoTuneActive) {
        performance2.autoTuneActive = false;
        savePerformance2Data();
        applyPerformance2State();
      }
      return;
    }

    // Background-tab scheduling can distort activity timing. Do not make
    // Auto-Tune decisions while the document is hidden.
    if (document.hidden) return;

    const domNodes = currentPerformance2DomNodes(false);
    const pressure = calculatePerformance2Pressure(
      domNodes,
      perf2MutationRate,
      perf2LongTaskRate
    );

    perf2PressureScore = pressure;

    if (pressure >= 85) {
      perf2HighPressureSamples += 1;
      perf2LowPressureSamples = 0;
    } else if (pressure <= 45) {
      perf2LowPressureSamples += 1;
      perf2HighPressureSamples = 0;
    } else {
      // Mid-band = hold state, but do not accumulate toward either transition.
      perf2HighPressureSamples = 0;
      perf2LowPressureSamples = 0;
    }

    // Require sustained pressure before enabling Auto-Tune.
    if (!performance2.autoTuneActive && perf2HighPressureSamples >= 3) {
      performance2.autoTuneActive = true;
      performance2.tuneCount += 1;
      perf2HighPressureSamples = 0;
      savePerformance2Data();
      applyPerformance2State();
      return;
    }

    // Longer low-pressure window prevents rapid on/off thrashing.
    if (performance2.autoTuneActive && perf2LowPressureSamples >= 4) {
      performance2.autoTuneActive = false;
      perf2LowPressureSamples = 0;
      savePerformance2Data();
      applyPerformance2State();
    }
  }

  function performance2Tick() {
    if (!powerToolsActive()) {
      updatePerformance2Badge();
      return;
    }

    samplePerformance2MutationRate();
    samplePerformance2LongTaskRate();

    // Refresh the expensive full DOM count only occasionally.
    currentPerformance2DomNodes(false);

    if (performance2.enabled) {
      evaluatePerformance2AutoTune();
    }

    if (performance2.diagnosticObserver) {
      installPerformance2LongTaskObserver();
    } else {
      disconnectPerformance2LongTaskObserver();
    }

    if (perf2HintStateDirty) {
      perf2HintStateDirty = false;
      savePerformance2Data();
    }

    updatePerformance2Badge();

    // Hidden Performance tab no longer receives needless metric updates.
    if (
      panel
      && !panel.hidden
      && dashboardActiveTab === 'performance2'
    ) {
      updatePerformance2MetricsUI();
    }
  }

  function startPerformance2Ticker() {
    clearTimeout(perf2TickerHandle);

    installPerformance2MutationCounter();
    installPerformance2LongTaskObserver();

    // Initial DOM measurement once; subsequent measurements are cached.
    currentPerformance2DomNodes(true);

    // One idle media pass for already-mounted content. New media is handled
    // incrementally by the shared core observer.
    optimizeVisibleMediaHints(true);

    const schedule = delay => {
      clearTimeout(perf2TickerHandle);
      perf2TickerHandle = setTimeout(() => {
        performance2Tick();
        schedule(
          performance2.enabled
          && performance2.backgroundEfficiency
          && document.hidden
            ? 15000
            : 5000
        );
      }, delay);
    };

    performance2Tick();
    schedule(document.hidden ? 15000 : 5000);
  }

  function ensurePerformance2Badge() {
    if (!document.body) return null;

    let badge = document.getElementById('dpt-performance2-badge');

    if (!badge) {
      badge = el('button', {
        id: 'dpt-performance2-badge',
        type: 'button',
        title: 'Discord PowerTools Performance+ 2.0'
      });

      badge.addEventListener('click', () => {
        if (!panel) return;
        panel.hidden = false;
        setDashboardTab('performance2', { scroll: false, instant: true });
        renderPerformance2Center();
      });

      document.body.appendChild(badge);
    }

    return badge;
  }

  function updatePerformance2Badge() {
    const badge = ensurePerformance2Badge();
    if (!badge) return;

    const show = effectivePerformance2() && performance2.showPerformanceBadge;
    badge.hidden = !show;
    if (!show) return;

    const dom = currentPerformance2DomNodes(false);
    badge.textContent = performance2.autoTuneActive && !stableSafeModeActive()
      ? `PERF+ AUTO • ${dom} DOM`
      : `PERF+ • ${dom} DOM`;
  }

  function updatePerformance2MetricsUI() {
    if (!panel) return;

    const snapshot = performance2Snapshot(false);
    const load = performance2LoadSummary(snapshot);

    const map = {
      dom: snapshot.domNodes.toLocaleString(),
      mutation: `${snapshot.mutationRatePerSec}/s`,
      longtasks: String(snapshot.longTasks),
      memory: snapshot.memoryMB ? `${snapshot.memoryMB.toFixed(1)} MB` : 'N/A',
      hints: String(snapshot.imageHintsApplied),
      mode: performance2.autoTuneActive ? 'AUTO' : performance2.profile.toUpperCase()
    };

    panel.querySelectorAll('[data-perf2-metric]').forEach(node => {
      const key = node.getAttribute('data-perf2-metric');
      if (key in map) node.textContent = map[key];
    });

    const percent = panel.querySelector('[data-perf2-load-percent]');
    const note = panel.querySelector('[data-perf2-load-note]');
    const fill = panel.querySelector('[data-perf2-load-fill]');
    const pill = panel.querySelector('[data-perf2-load-pill]');
    const domDetail = panel.querySelector('[data-perf2-load-dom]');
    const mutationDetail = panel.querySelector('[data-perf2-load-mutation]');

    if (percent) percent.textContent = `${load.percent}%`;
    if (note) note.textContent = load.note;

    if (fill) {
      fill.style.width = `${Math.max(4, Math.min(100, load.percent))}%`;
      fill.className = `dpt-perf2-load-fill ${load.className}`;
    }

    if (pill) {
      pill.className = `dpt-perf2-load-pill ${load.className}`;
      pill.textContent = `${load.label} Load`;
    }

    if (domDetail) {
      domDetail.textContent =
        `DOM ${snapshot.domNodes.toLocaleString()} / ${Number(performance2.highLoadDomThreshold).toLocaleString()}`;
    }

    if (mutationDetail) {
      mutationDetail.textContent =
        `Mutations ${snapshot.mutationRatePerSec}/s / ${performance2.highLoadMutationRate}/s`;
    }
  }

  function resetPerformance2Diagnostics() {
    perf2LongTaskCount = 0;
    perf2LongTaskTime = 0;
    perf2LastLongTaskCount = 0;
    perf2LongTaskRate = 0;
    perf2LastLongTaskSampleAt = performance.now();

    perf2MutationCount = 0;
    perf2LastMutationCount = 0;
    perf2MutationRate = 0;
    perf2LastMutationSampleAt = performance.now();

    perf2PressureScore = 0;
    perf2HighPressureSamples = 0;
    perf2LowPressureSamples = 0;
    perf2DomDirty = true;

    performance2.imageOptimizedCount = 0;
    performance2.tuneCount = 0;
    performance2.autoTuneActive = false;
    savePerformance2Data();
    applyPerformance2State();

    renderPerformance2Center();
    toast('Performance+ diagnostics reset');
  }

  function runPerformance2OptimizeNow() {
    applyPerformance2State();
    optimizeVisibleMediaHints(true);

    if (settings.performancePlus) {
      applySettings();
    }

    renderPerformance2Center();
    toast('Performance+ optimization pass complete');
  }

  function performance2LoadSummary(snapshot) {
    const pressure = Math.max(
      0,
      Math.min(
        100,
        Number.isFinite(snapshot.pressureScore)
          ? snapshot.pressureScore
          : calculatePerformance2Pressure(
              snapshot.domNodes,
              snapshot.mutationRatePerSec,
              snapshot.longTaskRatePerSec
            )
      )
    );

    const domOverReference =
      Number(snapshot.domNodes || 0) >= Number(performance2.highLoadDomThreshold || 5500);

    const activityLow =
      Number(snapshot.mutationRatePerSec || 0) < Number(performance2.highLoadMutationRate || 700) * 0.25
      && Number(snapshot.longTaskRatePerSec || 0) < 0.35;

    if (pressure >= 85) {
      return {
        label: 'High',
        className: 'high',
        percent: pressure,
        note: 'Sustained activity is approaching Auto-Tune conditions'
      };
    }

    if (pressure >= 50) {
      return {
        label: 'Moderate',
        className: 'moderate',
        percent: pressure,
        note: 'Client activity is elevated but below Auto-Tune pressure'
      };
    }

    return {
      label: 'Low',
      className: 'low',
      percent: Math.max(4, pressure),
      note: domOverReference && activityLow
        ? 'Large DOM, but current mutation and long-task activity is low'
        : 'Current client activity is comfortably below Auto-Tune pressure'
    };
  }

  function performance2ThresholdCard(label, key, min, max, step, suffix, note) {
    const input = el('input', {
      class: 'dpt-perf2-threshold-input',
      type: 'number',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(performance2[key])
    });

    input.addEventListener('change', () => {
      const value = Math.max(
        min,
        Math.min(max, Number(input.value || performance2[key]))
      );

      performance2[key] = value;
      input.value = String(value);
      savePerformance2Data();
      renderPerformance2Center();
    });

    return el('div', { class: 'dpt-perf2-threshold-card' }, [
      el('div', { class: 'dpt-perf2-threshold-top' }, [
        el('span', { class: 'dpt-perf2-threshold-label', text: label }),
        el('div', { class: 'dpt-perf2-threshold-value' }, [
          input,
          el('span', { text: suffix })
        ])
      ]),
      el('div', { class: 'dpt-perf2-threshold-note', text: note })
    ]);
  }

  function performance2MetricCard(value, label, key, tone = '') {
    return el('div', {
      class: `dpt-perf2-metric${tone ? ` ${tone}` : ''}`
    }, [
      el('b', { 'data-perf2-metric': key, text: value }),
      el('span', { text: label })
    ]);
  }

  function renderPerformance2Center() {
    const container = panel?.querySelector('[data-performance2-center]');
    if (!container) return;

    const snapshot = performance2Snapshot(true);
    const load = performance2LoadSummary(snapshot);

    const profileName = {
      balanced: 'Balanced',
      smooth: 'Smooth',
      battery: 'Battery Saver'
    }[performance2.profile] || performance2.profile;

    const status = el('div', { class: 'dpt-perf2-hero' }, [
      el('div', { class: 'dpt-perf2-hero-copy' }, [
        el('div', { class: 'dpt-perf2-hero-kicker', text: 'PERFORMANCE+ 2.0' }),
        el('div', {
          class: 'dpt-perf2-hero-title',
          text: performance2.enabled
            ? `${profileName} Profile`
            : 'Performance+ 2.0 Disabled'
        }),
        el('div', {
          class: 'dpt-perf2-hero-sub',
          text: performance2.autoTuneActive
            ? 'Auto-Tune is actively reducing rendering pressure.'
            : 'Adaptive local optimization and diagnostics for Discord Web.'
        })
      ]),
      el('div', { class: 'dpt-perf2-hero-pills' }, [
        el('span', {
          class: `dpt-perf2-state-pill${performance2.enabled ? ' active' : ''}`,
          text: performance2.autoTuneActive
            ? 'AUTO-TUNE'
            : (performance2.enabled ? 'ACTIVE' : 'OFF')
        }),
        el('span', {
          class: `dpt-perf2-load-pill ${load.className}`,
          'data-perf2-load-pill': '1',
          text: `${load.label} Load`
        })
      ])
    ]);

    const loadPanel = el('div', { class: 'dpt-perf2-load-panel' }, [
      el('div', { class: 'dpt-perf2-load-head' }, [
        el('div', {}, [
          el('div', { class: 'dpt-perf2-load-title', text: 'Current Client Load' }),
          el('div', { class: 'dpt-perf2-load-note', 'data-perf2-load-note': '1', text: load.note })
        ]),
        el('strong', { 'data-perf2-load-percent': '1', text: `${load.percent}%` })
      ]),
      el('div', { class: 'dpt-perf2-load-track' }, [
        el('div', {
          class: `dpt-perf2-load-fill ${load.className}`,
          'data-perf2-load-fill': '1',
          style: `width:${Math.max(4, Math.min(100, load.percent))}%`
        })
      ]),
      el('div', { class: 'dpt-perf2-load-detail' }, [
        el('span', {
          'data-perf2-load-dom': '1',
          text: `DOM ${snapshot.domNodes.toLocaleString()} / ${Number(performance2.highLoadDomThreshold).toLocaleString()}`
        }),
        el('span', {
          'data-perf2-load-mutation': '1',
          text: `Mutations ${snapshot.mutationRatePerSec}/s / ${performance2.highLoadMutationRate}/s`
        })
      ])
    ]);

    const master = performance2ToggleRow(
      'Enable Performance+ 2.0',
      'enabled',
      'Adds lightweight client-side optimization hints and diagnostics on top of the original Performance+ engine.'
    );

    const presets = el('div', { class: 'dpt-perf2-profile-grid' }, [
      button(
        performance2.profile === 'balanced' ? 'Balanced ✓' : 'Balanced',
        () => applyPerformance2Profile('balanced')
      ),
      button(
        performance2.profile === 'smooth' ? 'Smooth ✓' : 'Smooth',
        () => applyPerformance2Profile('smooth')
      ),
      button(
        performance2.profile === 'battery' ? 'Battery Saver ✓' : 'Battery Saver',
        () => applyPerformance2Profile('battery')
      ),
      button('Optimize Now', runPerformance2OptimizeNow)
    ]);

    const controls = el('div', { class: 'dpt-perf2-control-stack' }, [
      performance2ToggleRow(
        'Background Efficiency',
        'backgroundEfficiency',
        'Reduces extra PowerTools work while Discord is in a background tab.'
      ),
      performance2ToggleRow(
        'Lazy Media Hints',
        'lazyMediaHints',
        'Uses native lazy-loading hints for larger images when safe.'
      ),
      performance2ToggleRow(
        'Async Image Decode',
        'asyncImageDecode',
        'Lets compatible images decode asynchronously.'
      ),
      performance2ToggleRow(
        'Reduce Offscreen Paint',
        'reduceOffscreenPaint',
        'Uses content-visibility hints on compatible message containers.'
      ),
      performance2ToggleRow(
        'Compact Heavy Effects',
        'compactHeavyEffects',
        'Reduces heavy message-content effects while keeping Discord menus, dialogs, and autocomplete native.'
      ),
      performance2ToggleRow(
        'Adaptive Motion',
        'adaptiveMotion',
        'Reduces nonessential motion under heavier client load.'
      ),
      performance2ToggleRow(
        'Long-Task Diagnostics',
        'diagnosticObserver',
        'Tracks browser long tasks when PerformanceObserver supports them.'
      ),
      performance2ToggleRow(
        'Performance Badge',
        'showPerformanceBadge',
        'Shows a small local DOM/performance badge.'
      ),
      performance2ToggleRow(
        'Auto-Tune on High Load',
        'autoTuneOnHighLoad',
        'Temporarily enables stronger rendering reductions when a configured threshold is reached.'
      )
    ]);

    const thresholds = el('div', { class: 'dpt-perf2-threshold-grid' }, [
      performance2ThresholdCard(
        'DOM Threshold',
        'highLoadDomThreshold',
        1500, 12000, 100, 'nodes',
        'DOM size is a weighted pressure signal; crossing this value alone no longer activates Auto-Tune.'
      ),
      performance2ThresholdCard(
        'Mutation Threshold',
        'highLoadMutationRate',
        50, 3000, 50, '/sec',
        'Mutation activity is the primary Auto-Tune pressure signal and is combined with DOM size and long tasks.'
      )
    ]);

    const domTone = snapshot.domNodes >= performance2.highLoadDomThreshold
      ? 'danger'
      : (snapshot.domNodes >= performance2.highLoadDomThreshold * 0.7 ? 'warn' : '');

    const mutationTone = snapshot.mutationRatePerSec >= performance2.highLoadMutationRate
      ? 'danger'
      : (snapshot.mutationRatePerSec >= performance2.highLoadMutationRate * 0.7 ? 'warn' : '');

    const metrics = el('div', { class: 'dpt-perf2-metrics' }, [
      performance2MetricCard(
        snapshot.domNodes.toLocaleString(),
        'DOM Nodes',
        'dom',
        domTone
      ),
      performance2MetricCard(
        `${snapshot.mutationRatePerSec}/s`,
        'Mutations',
        'mutation',
        mutationTone
      ),
      performance2MetricCard(
        String(snapshot.longTasks),
        'Long Tasks',
        'longtasks',
        snapshot.longTasks >= 50 ? 'warn' : ''
      ),
      performance2MetricCard(
        snapshot.memoryMB ? `${snapshot.memoryMB.toFixed(1)} MB` : 'N/A',
        'JS Memory',
        'memory'
      ),
      performance2MetricCard(
        String(snapshot.imageHintsApplied),
        'Media Hints',
        'hints'
      ),
      performance2MetricCard(
        performance2.autoTuneActive ? 'AUTO' : performance2.profile.toUpperCase(),
        'Mode',
        'mode',
        performance2.autoTuneActive ? 'accent' : ''
      )
    ]);

    const reportActions = el('div', { class: 'dpt-perf2-action-group' }, [
      el('div', { class: 'dpt-perf2-action-title', text: 'Reports' }),
      el('div', { class: 'dpt-grid dpt-perf2-tools' }, [
        button(
          'Copy Performance Report',
          () => copyText(JSON.stringify(performance2Snapshot(), null, 2))
        ),
        button(
          'Copy Performance Config',
          () => copyText(JSON.stringify(performance2, null, 2))
        )
      ])
    ]);

    const maintenanceActions = el('div', { class: 'dpt-perf2-action-group' }, [
      el('div', { class: 'dpt-perf2-action-title', text: 'Maintenance' }),
      el('div', { class: 'dpt-grid dpt-perf2-tools' }, [
        button('Reapply Media Hints', () => {
          optimizeVisibleMediaHints(true);
          renderPerformance2Center();
          toast('Media optimization hints reapplied');
        }),
        button('Reset Diagnostics', resetPerformance2Diagnostics, true)
      ])
    ]);

    container.replaceChildren(
      status,
      loadPanel,
      master,
      el('div', { class: 'dpt-perf2-section-label', text: 'Performance Profiles' }),
      presets,
      el('div', { class: 'dpt-perf2-section-label', text: 'Optimization Controls' }),
      controls,
      el('div', { class: 'dpt-perf2-section-label', text: 'Auto-Tune Thresholds' }),
      thresholds,
      el('div', { class: 'dpt-perf2-section-label', text: 'Live Performance Diagnostics' }),
      metrics,
      reportActions,
      maintenanceActions
    );

    updatePerformance2MetricsUI();
    updatePerformance2Badge();
  }

  function normalizeStableReleaseData(value) {
    const data = value && typeof value === 'object' ? value : {};

    return {
      version: 1,
      safeMode: !!data.safeMode,
      bootCount: Math.max(0, finiteNumber(data.bootCount, 0)),
      lastBootAt: Math.max(0, finiteNumber(data.lastBootAt, 0)),
      lastHealthyAt: Math.max(0, finiteNumber(data.lastHealthyAt, 0)),
      firstStableBootAt: Math.max(0, finiteNumber(data.firstStableBootAt, 0))
    };
  }

  function loadStableReleaseData() {
    try {
      const stored = readStoredValue(STABLE_RELEASE_KEY, null);

      return normalizeStableReleaseData(stored);
    } catch {
      return normalizeStableReleaseData(null);
    }
  }

  function saveStableReleaseData() {
    return writeStoredValue(STABLE_RELEASE_KEY, { ...stableRelease });
  }

  function registerStableBoot() {
    const now = Date.now();

    stableRelease.bootCount += 1;
    stableRelease.lastBootAt = now;

    if (!stableRelease.firstStableBootAt) {
      stableRelease.firstStableBootAt = now;
    }

    saveStableReleaseData();
  }

  function stableHealthChecks() {
    const checks = [
      {
        id: 'core',
        name: 'Core',
        pass: typeof applySettings === 'function'
          && typeof buildUI === 'function'
          && typeof saveSettings === 'function'
      },
      {
        id: 'workspace',
        name: 'Workspace Profiles',
        pass: typeof renderWorkspaceProfiles === 'function'
          && typeof workspaceSnapshot === 'function'
          && typeof applyWorkspaceBundle === 'function'
      },
      {
        id: 'search',
        name: 'Smart Search & Jump',
        pass: typeof renderSmartSearchCenter === 'function'
          && typeof buildSmartSearchIndex === 'function'
          && typeof runSmartSearch === 'function'
      },
      {
        id: 'theme',
        name: 'Theme Studio',
        pass: typeof THEME_PRESETS === 'object'
          && Object.keys(THEME_PRESETS).length >= 9
          && typeof applyThemeVariables === 'function'
      },
      {
        id: 'navigation',
        name: 'Server Workspace+',
        pass: typeof renderServerChannelStudio === 'function'
          && typeof startRouteTracker === 'function'
          && typeof serverWorkspacePanel === 'function'
          && typeof applyServerWorkspaceRecord === 'function'
      },
      {
        id: 'messages',
        name: 'Message Utilities 2.0',
        pass: typeof renderMessageUtilities === 'function'
          && typeof installMessagePicker === 'function'
      },
      {
        id: 'media',
        name: 'Media Center 2.0',
        pass: typeof renderMediaAttachmentTools === 'function'
          && typeof extractSelectedMediaItems === 'function'
      },
      {
        id: 'focus',
        name: 'Focus & Productivity',
        pass: typeof renderFocusProductivityCenter === 'function'
          && typeof startFocusTicker === 'function'
      },
      {
        id: 'privacy',
        name: 'Notification / Privacy',
        pass: typeof renderNotificationControl === 'function'
          && typeof renderPrivacyTrackingControl === 'function'
      },
      {
        id: 'performance',
        name: 'Performance+ 2.0',
        pass: typeof renderPerformance2Center === 'function'
          && typeof performance2Snapshot === 'function'
          && typeof cssText === 'function'
      }
    ];

    const passed = checks.filter(check => check.pass).length;

    const result = {
      checkedAt: Date.now(),
      passed,
      total: checks.length,
      healthy: passed === checks.length,
      checks
    };

    stableLastHealth = result;

    if (result.healthy) {
      stableRelease.lastHealthyAt = result.checkedAt;
      saveStableReleaseData();
    }

    return result;
  }

  function stableInitTimeMs() {
    const end = stableBootCompletedAt || performance.now();
    return Math.max(0, end - stableBootStartedAt);
  }

  function markStableBootComplete() {
    if (stableBootCompletedAt) return;
    stableBootCompletedAt = performance.now();
  }

  function stableSystemReport() {
    const health = stableHealthChecks();
    const perf = typeof performance2Snapshot === 'function'
      ? performance2Snapshot()
      : null;

    return {
      product: 'Discord PowerTools',
      version: VERSION,
      releaseChannel: RELEASE_CHANNEL,
      build: RELEASE_BUILD,
      route: location.pathname,
      enabled: !!settings.enabled,
      performancePlus: !!settings.performancePlus,
      performancePlus2: !!performance2?.enabled,
      performanceProfile: performance2?.profile || 'unknown',
      theme: settings.uiTheme,
      safeMode: !!stableRelease.safeMode,
      runtimeIssues: runtimeIssues.slice(0, 10),
      initTimeMs: Number(stableInitTimeMs().toFixed(2)),
      health: {
        passed: health.passed,
        total: health.total,
        healthy: health.healthy,
        checks: health.checks.map(check => ({
          name: check.name,
          pass: check.pass
        }))
      },
      modules: {
        launcher: !!document.getElementById('dpt-launcher'),
        dashboard: !!document.getElementById('dpt-panel'),
        fpsBadge: !!document.getElementById('dpt-fps-badge'),
        focusBadge: !!document.getElementById('dpt-focus-badge'),
        notificationBadge: !!document.getElementById('dpt-notification-badge'),
        privacyBadge: !!document.getElementById('dpt-privacy-badge'),
        performanceBadge: !!document.getElementById('dpt-performance2-badge')
      },
      stable: {
        bootCount: stableRelease.bootCount,
        firstStableBootAt: stableRelease.firstStableBootAt,
        lastBootAt: stableRelease.lastBootAt,
        lastHealthyAt: stableRelease.lastHealthyAt
      }
    };
  }

  function stableSystemReportText() {
    const report = stableSystemReport();

    const checkLines = report.health.checks
      .map(check => `${check.pass ? 'PASS' : 'FAIL'} — ${check.name}`)
      .join('\n');

    return [
      'Discord PowerTools — Stable System Report',
      `Version: ${report.version}`,
      `Release Channel: ${report.releaseChannel}`,
      `Build: ${report.build}`,
      `Route: ${report.route}`,
      `Enabled: ${report.enabled ? 'Yes' : 'No'}`,
      `Performance+: ${report.performancePlus ? 'ON' : 'OFF'}`,
      `Performance+ 2.0: ${report.performancePlus2 ? 'ON' : 'OFF'} (${report.performanceProfile})`,
      `Theme: ${report.theme}`,
      `Safe Mode: ${report.safeMode ? 'ON' : 'OFF'}`,
      `Runtime Issues: ${report.runtimeIssues.length}`,
      `Init Time: ${report.initTimeMs.toFixed(2)} ms`,
      `Health: ${report.health.passed}/${report.health.total} passed`,
      '',
      checkLines
    ].join('\n');
  }

  function downloadLocalSnapshot() {
    let url;
    try {
      const blob = new Blob([JSON.stringify(stableBackupObject(), null, 2)], { type: 'application/json' });
      url = URL.createObjectURL(blob);
      const anchor = el('a', { href: url, download: `Discord-PowerTools-${VERSION}-${new Date().toISOString().slice(0, 10)}.json` });
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      toast('Snapshot download requested. Store it privately: it includes saved messages and notes.');
    } catch (error) {
      recordRuntimeIssue('Snapshot download', error);
      toast('Download unavailable. Use Copy Full Backup instead.');
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  function stableBackupObject() {
    return {
      product: 'Discord PowerTools',
      version: VERSION,
      exportedAt: new Date().toISOString(),
      settings: { ...settings },
      serverChannel: { ...navData },
      messages: { ...messageData },
      media: { ...mediaData },
      focus: { ...focusData },
      nitroCosmetic: {
        ...nitroCosmetic,
        avatarData: nitroCosmetic.avatarData ? '[local image data omitted]' : '',
        bannerData: nitroCosmetic.bannerData ? '[local image data omitted]' : ''
      },
      notifications: { ...notificationData },
      privacy: { ...privacyData },
      performance2: { ...performance2 },
      stable: { ...stableRelease },
      workspaceProfiles: {
        lastAppliedId: workspaceData.lastAppliedId,
        customProfiles: { ...workspaceData.customProfiles }
      }
,
      smartSearch: {
        shortcutEnabled: smartSearchData.shortcutEnabled,
        rememberQuery: smartSearchData.rememberQuery,
        recentQueries: [...smartSearchData.recentQueries],
        resultLimit: smartSearchData.resultLimit
      }
    };
  }

  function activateStableSafeMode() {
    // Safe Mode is an overlay, not a destructive settings rewrite.
    stableRelease.safeMode = true;
    saveStableReleaseData();

    if (performance2.autoTuneActive) {
      performance2.autoTuneActive = false;
      savePerformance2Data();
    }

    applySettings();
    safeRender('Stable Release Center', renderStableReleaseCenter);
    updateUI();

    toast('Stable Safe Mode enabled');
  }

  function exitStableSafeMode() {
    stableRelease.safeMode = false;
    saveStableReleaseData();

    applySettings();
    safeRender('Stable Release Center', renderStableReleaseCenter);
    updateUI();

    toast('Stable Safe Mode disabled — your previous settings are unchanged');
  }

  function renderStableHealthList(health) {
    return el(
      'div',
      { class: 'dpt-stable-health-list' },
      health.checks.map(check =>
        el('div', {
          class: `dpt-stable-health-item${check.pass ? ' pass' : ' fail'}`
        }, [
          el('span', {
            class: 'dpt-stable-health-dot',
            text: check.pass ? '✓' : '×'
          }),
          el('span', {
            text: check.name
          })
        ])
      )
    );
  }

  function renderStableReleaseCenter() {
    const container = panel?.querySelector('[data-stable-release-center]');
    if (!container) return;

    const health = stableHealthChecks();
    const initTime = stableInitTimeMs();

    const status = el('div', { class: 'dpt-stable-status' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-stable-status-title',
          text: 'Discord PowerTools Stable'
        }),
        el('div', {
          class: 'dpt-stable-status-sub',
          text: `${RELEASE_CHANNEL} • ${RELEASE_BUILD} • v${VERSION}`
        })
      ]),
      el('span', {
        class: `dpt-stable-pill${health.healthy ? ' healthy' : ' warning'}`,
        text: health.healthy
          ? `${health.passed}/${health.total} PASS`
          : `${health.passed}/${health.total}`
      })
    ]);

    const metrics = el('div', { class: 'dpt-stable-metrics' }, [
      el('div', { class: 'dpt-stable-metric' }, [
        el('b', { text: `${initTime.toFixed(1)} ms` }),
        el('span', { text: 'Init Time' })
      ]),
      el('div', { class: 'dpt-stable-metric' }, [
        el('b', { text: String(stableRelease.bootCount) }),
        el('span', { text: 'Stable Boots' })
      ]),
      el('div', { class: 'dpt-stable-metric' }, [
        el('b', { text: stableRelease.safeMode ? 'ON' : 'OFF' }),
        el('span', { text: 'Safe Mode' })
      ])
    ]);

    const actions = el('div', { class: 'dpt-grid dpt-stable-actions' }, [
      button('Run Health Check', () => {
        stableHealthChecks();
        renderStableReleaseCenter();
        toast('Stable health check complete');
      }),
      button('Copy System Report', () => copyText(stableSystemReportText())),
      button('Copy Full Backup', () => copyText(JSON.stringify(stableBackupObject(), null, 2))),
      button('Download JSON Snapshot', downloadLocalSnapshot),
      button(
        stableRelease.safeMode ? 'Exit Safe Mode' : 'Enable Safe Mode',
        stableRelease.safeMode ? exitStableSafeMode : activateStableSafeMode,
        !stableRelease.safeMode
      )
    ]);

    const recoveryNote = el('div', {
      class: 'dpt-stable-note',
      text: stableRelease.safeMode
        ? 'Safe Mode is active as a temporary overlay. Advanced privacy blocking, Auto-Tune, Discord-wide theme tint, Focus effects, media muting, and stronger rendering reductions are suspended without changing your saved settings.'
        : 'Stable Safe Mode temporarily suspends higher-risk visual/performance effects without rewriting your saved configuration.'
    });

    container.replaceChildren(
      status,
      metrics,
      el('div', { class: 'dpt-nav-group-title', text: 'System Health' }),
      renderStableHealthList(health),
      actions,
      recoveryNote
    );
  }

  const WORKSPACE_PRESETS = {
    gaming: {
      name: 'Gaming',
      description: 'Smooth performance, full navigation, visible notifications, and a compact Purple Dragon interface.',
      settings: {
        enabled: true,
        performancePlus: true,
        reducedMotion: false,
        disableBlur: true,
        lighterShadows: true,
        compactEffects: true,
        uiTheme: 'purple-dragon',
        themeDiscord: false,
        compactPanel: true,
        panelWidth: 350,
        panelOpacity: 96,
        launcherSize: 52,
        launcherGlow: true
      },
      focus: {
        focusMode: false
      },
      notification: {
        enabled: false,
        snoozeUntil: 0,
        quietHoursEnabled: false
      },
      privacy: {
        enabled: true,
        blockAnalyticsFetch: false,
        blockAnalyticsBeacon: false,
        blockErrorReporting: false
      },
      performance2: {
        enabled: true,
        profile: 'smooth',
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: false,
        compactHeavyEffects: false,
        adaptiveMotion: false,
        autoTuneOnHighLoad: false,
        autoTuneActive: false
      }
    },

    work: {
      name: 'Work',
      description: 'Writing-focused workspace with quieter notifications, balanced performance, and a Slate interface.',
      settings: {
        enabled: true,
        performancePlus: true,
        reducedMotion: true,
        disableBlur: true,
        lighterShadows: true,
        compactEffects: true,
        uiTheme: 'slate',
        themeDiscord: false,
        compactPanel: true,
        panelWidth: 350,
        panelOpacity: 96,
        launcherSize: 50,
        launcherGlow: false
      },
      focus: {
        focusMode: true,
        hideServers: true,
        hideChannels: false,
        hideMembers: true,
        hideActivity: true,
        quietBadges: true,
        dimMedia: true,
        compactMessages: false
      },
      notification: {
        enabled: true,
        hideMentionBadges: true,
        hideUnreadDots: true,
        cleanTitleCount: true,
        focusSync: true,
        snoozeUntil: 0
      },
      privacy: {
        enabled: true,
        stripTrackingParams: true,
        privateExternalOpen: true,
        sanitizeCopiedLinks: true,
        blockAnalyticsFetch: false,
        blockAnalyticsBeacon: false,
        blockErrorReporting: false
      },
      performance2: {
        enabled: true,
        profile: 'balanced',
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: true,
        compactHeavyEffects: true,
        adaptiveMotion: true,
        autoTuneOnHighLoad: false,
        autoTuneActive: false
      }
    },

    focus: {
      name: 'Focus',
      description: 'Minimal-distraction layout with quiet notifications, AMOLED visuals, and Battery Saver performance.',
      settings: {
        enabled: true,
        performancePlus: true,
        reducedMotion: true,
        disableBlur: true,
        lighterShadows: true,
        compactEffects: true,
        uiTheme: 'amoled',
        themeDiscord: false,
        compactPanel: true,
        panelWidth: 340,
        panelOpacity: 98,
        launcherSize: 48,
        launcherGlow: false
      },
      focus: {
        focusMode: true,
        hideServers: true,
        hideChannels: true,
        hideMembers: true,
        hideActivity: true,
        quietBadges: true,
        dimMedia: true,
        compactMessages: true
      },
      notification: {
        enabled: true,
        hideMentionBadges: true,
        hideUnreadDots: true,
        softenNotificationBadges: false,
        cleanTitleCount: true,
        focusSync: true,
        snoozeUntil: 0
      },
      privacy: {
        enabled: true,
        stripTrackingParams: true,
        privateExternalOpen: true,
        sanitizeCopiedLinks: true,
        blockAnalyticsFetch: false,
        blockAnalyticsBeacon: false,
        blockErrorReporting: false
      },
      performance2: {
        enabled: true,
        profile: 'battery',
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: true,
        compactHeavyEffects: true,
        adaptiveMotion: true,
        autoTuneOnHighLoad: false,
        autoTuneActive: false
      }
    },

    minimal: {
      name: 'Minimal',
      description: 'Small dashboard, subtle launcher, no active Focus Mode, and conservative Balanced performance.',
      settings: {
        enabled: true,
        performancePlus: true,
        reducedMotion: true,
        disableBlur: true,
        lighterShadows: true,
        compactEffects: true,
        uiTheme: 'midnight',
        themeDiscord: false,
        compactPanel: true,
        panelWidth: 320,
        panelOpacity: 94,
        launcherSize: 44,
        launcherGlow: false
      },
      focus: {
        focusMode: false
      },
      notification: {
        enabled: false,
        snoozeUntil: 0
      },
      privacy: {
        enabled: true,
        blockAnalyticsFetch: false,
        blockAnalyticsBeacon: false,
        blockErrorReporting: false
      },
      performance2: {
        enabled: true,
        profile: 'balanced',
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: true,
        compactHeavyEffects: true,
        adaptiveMotion: true,
        autoTuneOnHighLoad: false,
        autoTuneActive: false
      }
    },

    streaming: {
      name: 'Streaming',
      description: 'Smooth rendering with locally quiet notification visuals and a clean Discord-style workspace.',
      settings: {
        enabled: true,
        performancePlus: true,
        reducedMotion: false,
        disableBlur: true,
        lighterShadows: true,
        compactEffects: true,
        uiTheme: 'discord',
        themeDiscord: false,
        compactPanel: true,
        panelWidth: 350,
        panelOpacity: 94,
        launcherSize: 48,
        launcherGlow: false
      },
      focus: {
        focusMode: false,
        hideServers: false,
        hideChannels: false,
        hideMembers: false,
        hideActivity: true,
        quietBadges: true,
        dimMedia: false,
        compactMessages: false
      },
      notification: {
        enabled: true,
        hideMentionBadges: true,
        hideUnreadDots: true,
        softenNotificationBadges: false,
        cleanTitleCount: true,
        muteMediaElements: false,
        focusSync: false,
        snoozeUntil: 0
      },
      privacy: {
        enabled: true,
        stripTrackingParams: true,
        privateExternalOpen: true,
        sanitizeCopiedLinks: true,
        blockAnalyticsFetch: false,
        blockAnalyticsBeacon: false,
        blockErrorReporting: false
      },
      performance2: {
        enabled: true,
        profile: 'smooth',
        backgroundEfficiency: true,
        lazyMediaHints: true,
        asyncImageDecode: true,
        reduceOffscreenPaint: false,
        compactHeavyEffects: false,
        adaptiveMotion: false,
        autoTuneOnHighLoad: false,
        autoTuneActive: false
      }
    }
  };

  function normalizeWorkspaceData(value) {
    const data = value && typeof value === 'object' ? value : {};
    const custom = data.customProfiles && typeof data.customProfiles === 'object'
      ? data.customProfiles
      : {};

    const cleanCustom = {};

    for (const [id, profile] of Object.entries(custom)) {
      if (!profile || typeof profile !== 'object') continue;

      const name = String(profile.name || '').trim().slice(0, 40);
      if (!name) continue;

      cleanCustom[id] = {
        id,
        name,
        createdAt: Math.max(0, Number(profile.createdAt || Date.now())),
        updatedAt: Math.max(0, Number(profile.updatedAt || Date.now())),
        snapshot: profile.snapshot && typeof profile.snapshot === 'object'
          ? profile.snapshot
          : {}
      };
    }

    return {
      version: 1,
      lastAppliedId: String(data.lastAppliedId || ''),
      customProfiles: cleanCustom
    };
  }

  function loadWorkspaceData() {
    try {
      const stored = readStoredValue(WORKSPACE_DATA_KEY, null);

      return normalizeWorkspaceData(stored);
    } catch {
      return normalizeWorkspaceData(null);
    }
  }

  function saveWorkspaceData() {
    return writeStoredValue(WORKSPACE_DATA_KEY, {
          version: 1,
          lastAppliedId: workspaceData.lastAppliedId,
          customProfiles: { ...workspaceData.customProfiles }
        });
  }

  function pickFields(source, keys) {
    const out = {};

    for (const key of keys) {
      if (source && Object.prototype.hasOwnProperty.call(source, key)) {
        out[key] = source[key];
      }
    }

    return out;
  }

  function workspaceSnapshot() {
    return {
      settings: pickFields(settings, [
        'enabled',
        'performancePlus',
        'reducedMotion',
        'disableBlur',
        'lighterShadows',
        'compactEffects',
        'imageRendering',
        'fpsMeter',
        'uiTheme',
        'themeDiscord',
        'compactPanel',
        'panelWidth',
        'panelOpacity',
        'launcherSize',
        'launcherGlow',
        'fpsPosition'
      ]),

      focus: pickFields(focusData, [
        'focusMode',
        'hideServers',
        'hideChannels',
        'hideMembers',
        'hideActivity',
        'quietBadges',
        'dimMedia',
        'compactMessages',
        'timerMinutes',
        'breakMinutes',
        'shortcutEnabled'
      ]),

      notification: pickFields(notificationData, [
        'enabled',
        'hideMentionBadges',
        'hideUnreadDots',
        'softenNotificationBadges',
        'cleanTitleCount',
        'muteMediaElements',
        'focusSync',
        'quietHoursEnabled',
        'quietStart',
        'quietEnd'
      ]),

      privacy: pickFields(privacyData, [
        'enabled',
        'stripTrackingParams',
        'privateExternalOpen',
        'sanitizeCopiedLinks',
        'blockAnalyticsBeacon',
        'blockAnalyticsFetch',
        'blockErrorReporting',
        'maskInviteQueryParams',
        'hideExternalLinkPreviewOnHover',
        'auditLimit'
      ]),

      performance2: pickFields(performance2, [
        'enabled',
        'profile',
        'backgroundEfficiency',
        'lazyMediaHints',
        'asyncImageDecode',
        'reduceOffscreenPaint',
        'compactHeavyEffects',
        'adaptiveMotion',
        'diagnosticObserver',
        'showPerformanceBadge',
        'autoTuneOnHighLoad',
        'highLoadDomThreshold',
        'highLoadMutationRate'
      ]),

      nitroCosmetic: pickFields(nitroCosmetic, [
        'enabled',
        'accent1',
        'accent2',
        'showNitroBadge',
        'avatarRing',
        'profileGlow',
        'emojiHover',
        'stickerHover',
        'reactionHover',
        'profileEffect',
        'effectSpeed'
      ]),

      panelPosition: readStoredValue(PANEL_KEY, null),
      launcherPosition: readStoredValue(LAUNCHER_KEY, null)
    };
  }

  function normalizeWorkspaceSettings(value) {
    const next = {
      ...settings,
      ...(value && typeof value === 'object' ? value : {})
    };

    if (!isValidThemeId(next.uiTheme)) {
      next.uiTheme = settings.uiTheme;
    }

    next.panelWidth = Math.max(320, Math.min(460, Number(next.panelWidth || 360)));
    next.panelOpacity = Math.max(75, Math.min(100, Number(next.panelOpacity || 96)));
    next.launcherSize = Math.max(42, Math.min(76, Number(next.launcherSize || 54)));

    const validFpsPositions = new Set([
      'top-right',
      'top-center',
      'top-left',
      'bottom-right',
      'bottom-left'
    ]);

    if (!validFpsPositions.has(next.fpsPosition)) {
      next.fpsPosition = settings.fpsPosition;
    }

    return next;
  }

  function applyWorkspaceBundle(bundle, label = 'Workspace', profileId = '') {
    if (!bundle || typeof bundle !== 'object') return;

    settings = normalizeWorkspaceSettings(bundle.settings);

    focusData = normalizeFocusData({
      ...focusData,
      ...(bundle.focus || {})
    });

    // Workspace switching never starts/stops or resets productivity stats.
    // It only changes the visual/focus configuration.
    focusData.timerRunning = !!focusData.timerRunning;

    notificationData = normalizeNotificationData({
      ...notificationData,
      ...(bundle.notification || {})
    });

    privacyData = normalizePrivacyData({
      ...privacyData,
      ...(bundle.privacy || {})
    });

    performance2 = normalizePerformance2Data({
      ...performance2,
      ...(bundle.performance2 || {}),
      autoTuneActive: false
    });

    nitroCosmetic = normalizeNitroCosmeticData({
      ...nitroCosmetic,
      ...(bundle.nitroCosmetic || {}),
      // Large local image assets are intentionally not workspace-scoped.
      avatarData: nitroCosmetic.avatarData,
      bannerData: nitroCosmetic.bannerData
    });

    saveSettings();
    saveFocusData();
    saveNotificationData();
    savePrivacyData();
    savePerformance2Data();
    saveNitroCosmeticData();

    if (
      bundle.panelPosition
      && typeof bundle.panelPosition.x === 'number'
      && typeof bundle.panelPosition.y === 'number'
    ) {
      writeStoredValue(PANEL_KEY, {
        x: bundle.panelPosition.x,
        y: bundle.panelPosition.y
      });
    }

    if (
      bundle.launcherPosition
      && typeof bundle.launcherPosition.x === 'number'
      && typeof bundle.launcherPosition.y === 'number'
    ) {
      writeStoredValue(LAUNCHER_KEY, {
        x: bundle.launcherPosition.x,
        y: bundle.launcherPosition.y
      });
    }

    workspaceData.lastAppliedId = profileId;
    saveWorkspaceData();

    applySettings();
    applyFocusState();
    applyNitroCosmeticState();
    applyNotificationControlState();
    applyPrivacyState();
    applyPerformance2State();

    if (panel) {
      restorePanelPosition();
    }

    if (launcher) {
      restoreLauncherPosition();
    }

    updateUI();
    toast(`${label} workspace applied`);
  }

  function applyBuiltInWorkspace(id) {
    const preset = WORKSPACE_PRESETS[id];
    if (!preset) return;

    const base = workspaceSnapshot();

    const bundle = {
      ...base,
      settings: {
        ...base.settings,
        ...(preset.settings || {})
      },
      focus: {
        ...base.focus,
        ...(preset.focus || {})
      },
      notification: {
        ...base.notification,
        ...(preset.notification || {})
      },
      privacy: {
        ...base.privacy,
        ...(preset.privacy || {})
      },
      performance2: {
        ...base.performance2,
        ...(preset.performance2 || {})
      },
      nitroCosmetic: {
        ...base.nitroCosmetic,
        ...(preset.nitroCosmetic || {})
      }
    };

    applyWorkspaceBundle(bundle, preset.name, `builtin:${id}`);
  }

  function workspaceProfileName(value) {
    return String(value || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 40);
  }

  function createCustomWorkspaceProfile(name) {
    const finalName = workspaceProfileName(name);

    if (!finalName) {
      toast('Enter a workspace profile name');
      return;
    }

    const profiles = Object.values(workspaceData.customProfiles);
    if (profiles.length >= 12) {
      toast('Maximum 12 custom workspace profiles');
      return;
    }

    const id = `custom:${Date.now().toString(36)}`;
    const now = Date.now();

    workspaceData.customProfiles[id] = {
      id,
      name: finalName,
      createdAt: now,
      updatedAt: now,
      snapshot: workspaceSnapshot()
    };

    workspaceData.lastAppliedId = id;
    saveWorkspaceData();
    renderWorkspaceProfiles();
    toast(`${finalName} workspace saved`);
  }

  function updateCustomWorkspaceProfile(id) {
    const profile = workspaceData.customProfiles[id];
    if (!profile) return;

    profile.snapshot = workspaceSnapshot();
    profile.updatedAt = Date.now();

    workspaceData.customProfiles[id] = profile;
    workspaceData.lastAppliedId = id;
    saveWorkspaceData();

    renderWorkspaceProfiles();
    toast(`${profile.name} updated`);
  }

  function deleteCustomWorkspaceProfile(id) {
    const profile = workspaceData.customProfiles[id];
    if (!profile) return;

    delete workspaceData.customProfiles[id];

    if (workspaceData.lastAppliedId === id) {
      workspaceData.lastAppliedId = '';
    }

    saveWorkspaceData();
    renderWorkspaceProfiles();
    toast(`${profile.name} deleted`);
  }

  function duplicateCustomWorkspaceProfile(id) {
    const profile = workspaceData.customProfiles[id];
    if (!profile) return;

    const profiles = Object.values(workspaceData.customProfiles);
    if (profiles.length >= 12) {
      toast('Maximum 12 custom workspace profiles');
      return;
    }

    const copyId = `custom:${Date.now().toString(36)}`;
    const now = Date.now();

    workspaceData.customProfiles[copyId] = {
      id: copyId,
      name: workspaceProfileName(`${profile.name} Copy`),
      createdAt: now,
      updatedAt: now,
      snapshot: JSON.parse(JSON.stringify(profile.snapshot || {}))
    };

    saveWorkspaceData();
    renderWorkspaceProfiles();
    toast('Workspace duplicated');
  }

  function workspaceLastAppliedLabel() {
    const id = workspaceData.lastAppliedId;

    if (!id) return 'None yet';

    if (id.startsWith('builtin:')) {
      const key = id.slice('builtin:'.length);
      return WORKSPACE_PRESETS[key]?.name || 'Built-in';
    }

    return workspaceData.customProfiles[id]?.name || 'Custom';
  }

  function builtInWorkspaceCard(id, preset) {
    const active = workspaceData.lastAppliedId === `builtin:${id}`;

    return el('div', {
      class: `dpt-workspace-card${active ? ' active' : ''}`
    }, [
      el('div', { class: 'dpt-workspace-card-copy' }, [
        el('div', { class: 'dpt-workspace-card-name', text: preset.name }),
        el('div', {
          class: 'dpt-workspace-card-desc',
          text: preset.description
        })
      ]),
      button(active ? 'Reapply' : 'Apply', () => applyBuiltInWorkspace(id))
    ]);
  }

  function customWorkspaceCard(profile) {
    const active = workspaceData.lastAppliedId === profile.id;

    const apply = button(
      active ? 'Reapply' : 'Apply',
      () => applyWorkspaceBundle(
        profile.snapshot,
        profile.name,
        profile.id
      )
    );
    apply.classList.add('dpt-nav-mini');

    const update = button(
      'Update',
      () => updateCustomWorkspaceProfile(profile.id)
    );
    update.classList.add('dpt-nav-mini');

    const duplicate = button(
      'Duplicate',
      () => duplicateCustomWorkspaceProfile(profile.id)
    );
    duplicate.classList.add('dpt-nav-mini');

    const remove = button(
      'Delete',
      () => deleteCustomWorkspaceProfile(profile.id),
      true
    );
    remove.classList.add('dpt-nav-mini');

    const timestamp = profile.updatedAt
      ? new Date(profile.updatedAt).toLocaleString()
      : 'Unknown';

    return el('div', {
      class: `dpt-workspace-custom${active ? ' active' : ''}`
    }, [
      el('div', { class: 'dpt-workspace-custom-copy' }, [
        el('div', { class: 'dpt-workspace-custom-name', text: profile.name }),
        el('div', {
          class: 'dpt-workspace-custom-meta',
          text: `Updated ${timestamp}`
        })
      ]),
      el('div', { class: 'dpt-nav-actions dpt-workspace-custom-actions' }, [
        apply,
        update,
        duplicate,
        remove
      ])
    ]);
  }

  function renderWorkspaceProfiles() {
    const container = panel?.querySelector('[data-workspace-profiles]');
    if (!container) return;

    const nameInput = el('input', {
      class: 'dpt-workspace-name-input',
      type: 'text',
      maxlength: '40',
      placeholder: 'New profile name…',
      autocomplete: 'off'
    });

    nameInput.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();

      const name = nameInput.value;
      nameInput.value = '';
      createCustomWorkspaceProfile(name);
    });

    const saveButton = button('Save Current Profile', () => {
      const name = nameInput.value;
      nameInput.value = '';
      createCustomWorkspaceProfile(name);
    });

    const builtIns = el(
      'div',
      { class: 'dpt-workspace-preset-list' },
      Object.entries(WORKSPACE_PRESETS).map(
        ([id, preset]) => builtInWorkspaceCard(id, preset)
      )
    );

    const customProfiles = Object.values(workspaceData.customProfiles)
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0));

    const customList = el(
      'div',
      { class: 'dpt-workspace-custom-list' },
      customProfiles.length
        ? customProfiles.map(customWorkspaceCard)
        : [
            el('div', {
              class: 'dpt-nav-empty',
              text: 'No custom workspace profiles yet. Configure PowerTools, enter a name, then save the current setup.'
            })
          ]
    );

    const status = el('div', { class: 'dpt-workspace-status' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-workspace-status-title',
          text: 'Workspace Profiles'
        }),
        el('div', {
          class: 'dpt-workspace-status-sub',
          text: `Last applied: ${workspaceLastAppliedLabel()}`
        })
      ]),
      el('span', {
        class: 'dpt-workspace-count',
        text: `${customProfiles.length}/12 CUSTOM`
      })
    ]);

    const saveRow = el('div', { class: 'dpt-workspace-save-row' }, [
      nameInput,
      saveButton
    ]);

    const tools = el('div', { class: 'dpt-grid dpt-workspace-tools' }, [
      button('Copy Current Workspace', () => {
        copyText(JSON.stringify(workspaceSnapshot(), null, 2));
      }),
      button('Copy Profiles Backup', () => {
        copyText(JSON.stringify({
          version: 1,
          exportedAt: new Date().toISOString(),
          lastAppliedId: workspaceData.lastAppliedId,
          customProfiles: workspaceData.customProfiles
        }, null, 2));
      }),
      button('Clear Last Applied', () => {
        workspaceData.lastAppliedId = '';
        saveWorkspaceData();
        renderWorkspaceProfiles();
        toast('Workspace status cleared');
      }),
      button('Refresh Workspace', () => {
        renderWorkspaceProfiles();
        toast('Workspace Profiles refreshed');
      })
    ]);

    container.replaceChildren(
      status,
      el('div', {
        class: 'dpt-workspace-note',
        text: 'Profiles switch local PowerTools configuration only. Saved messages, media bookmarks, channel notes, Focus statistics, timer progress, and local avatar/banner image data are not overwritten.'
      }),
      el('div', { class: 'dpt-nav-group-title', text: 'Built-In Profiles' }),
      builtIns,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Save Current Setup' }),
      saveRow,
      el('div', { class: 'dpt-nav-group-title', text: `Custom Profiles (${customProfiles.length})` }),
      customList,
      tools
    );
  }

  function normalizeSmartSearchData(value) {
    const data = value && typeof value === 'object' ? value : {};

    return {
      version: 1,
      shortcutEnabled: data.shortcutEnabled !== false,
      rememberQuery: data.rememberQuery !== false,
      lastQuery: String(data.lastQuery || '').slice(0, 160),
      recentQueries: Array.isArray(data.recentQueries)
        ? data.recentQueries
            .map(query => String(query || '').trim().slice(0, 160))
            .filter(Boolean)
            .slice(0, 8)
        : [],
      resultLimit: Math.max(10, Math.min(60, finiteNumber(data.resultLimit, 30)))
    };
  }

  function loadSmartSearchData() {
    try {
      const stored = readStoredValue(SMART_SEARCH_DATA_KEY, null);

      return normalizeSmartSearchData(stored);
    } catch {
      return normalizeSmartSearchData(null);
    }
  }

  function saveSmartSearchData() {
    return writeStoredValue(SMART_SEARCH_DATA_KEY, { ...smartSearchData });
  }

  function smartSearchRememberQuery(query) {
    const finalQuery = String(query || '').trim().slice(0, 160);

    if (!smartSearchData.rememberQuery) {
      smartSearchData.lastQuery = '';
      saveSmartSearchData();
      return;
    }

    smartSearchData.lastQuery = finalQuery;

    if (finalQuery.length >= 2) {
      smartSearchData.recentQueries = [
        finalQuery,
        ...smartSearchData.recentQueries.filter(item =>
          item.toLowerCase() !== finalQuery.toLowerCase()
        )
      ].slice(0, 8);
    }

    saveSmartSearchData();
  }

  function smartSearchText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s#@._:/-]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function smartSearchTerms(query) {
    return smartSearchText(query)
      .split(' ')
      .map(term => term.trim())
      .filter(Boolean);
  }

  function smartSearchScore(result, query) {
    const q = smartSearchText(query);
    if (!q) return Number(result.baseScore || 0);

    const terms = smartSearchTerms(q);
    if (!terms.length) return Number(result.baseScore || 0);

    const title = smartSearchText(result.title);
    const subtitle = smartSearchText(result.subtitle);
    const keywords = smartSearchText(result.keywords);
    const haystack = `${title} ${subtitle} ${keywords}`.trim();

    if (!terms.every(term => haystack.includes(term))) {
      return -1;
    }

    let score = Number(result.baseScore || 0);

    if (title === q) score += 120;
    if (title.startsWith(q)) score += 80;
    if (title.includes(q)) score += 55;
    if (subtitle.includes(q)) score += 25;

    for (const term of terms) {
      if (title === term) score += 45;
      else if (title.startsWith(term)) score += 30;
      else if (title.includes(term)) score += 20;

      if (subtitle.includes(term)) score += 8;
      if (keywords.includes(term)) score += 5;
    }

    return score;
  }

  function smartSearchChannelRecordForKey(key) {
    if (!key) return null;

    const favorite = navData.favorites?.[key];
    if (favorite) return favorite;

    const recent = navData.recent?.find?.(item => item?.key === key);
    if (recent) return recent;

    const parts = String(key).split(':');
    if (parts.length < 2) return null;

    const guildId = parts[0];
    const channelId = parts[1];

    return {
      key,
      guildId,
      channelId,
      path: `/channels/${guildId}/${channelId}`,
      serverName: guildId === '@me'
        ? 'Direct Messages'
        : `Server ${String(guildId).slice(-6)}`,
      channelName: `Channel ${String(channelId).slice(-6)}`
    };
  }

  function smartSearchResult({
    id,
    type,
    category,
    title,
    subtitle = '',
    keywords = '',
    baseScore = 0,
    icon = '⌕',
    actionLabel = 'Open',
    action,
    secondaryLabel = '',
    secondaryAction = null
  }) {
    return {
      id,
      type,
      category,
      title,
      subtitle,
      keywords,
      baseScore,
      icon,
      actionLabel,
      action,
      secondaryLabel,
      secondaryAction
    };
  }

  function buildSmartSearchIndex() {
    const results = [];

    // Built-in Workspace Profiles.
    for (const [id, preset] of Object.entries(WORKSPACE_PRESETS)) {
      results.push(smartSearchResult({
        id: `workspace:builtin:${id}`,
        type: 'Workspace',
        category: 'workspaces',
        title: preset.name,
        subtitle: `Built-in workspace • ${preset.description}`,
        keywords: `workspace profile preset ${id}`,
        baseScore: 85,
        icon: '◆',
        actionLabel: 'Apply',
        action: () => applyBuiltInWorkspace(id)
      }));
    }

    // Custom Workspace Profiles.
    for (const profile of Object.values(workspaceData.customProfiles || {})) {
      if (!profile?.id) continue;

      results.push(smartSearchResult({
        id: `workspace:${profile.id}`,
        type: 'Workspace',
        category: 'workspaces',
        title: profile.name,
        subtitle: 'Custom workspace profile',
        keywords: `workspace custom profile ${profile.name}`,
        baseScore: 95,
        icon: '◆',
        actionLabel: 'Apply',
        action: () => applyWorkspaceBundle(
          profile.snapshot,
          profile.name,
          profile.id
        )
      }));
    }

    // Server Workspace+ records.
    for (const record of Object.values(navData.serverWorkspaces || {})) {
      if (!record?.guildId) continue;

      const openPath =
        record.startChannel?.path
        || navData.serverFavorites?.[record.guildId]?.path
        || `/channels/${record.guildId}`;

      results.push(smartSearchResult({
        id: `server-workspace:${record.guildId}`,
        type: 'Server Workspace',
        category: 'navigation',
        title: record.serverName || `Server ${String(record.guildId).slice(-6)}`,
        subtitle: `${record.autoApply ? 'Auto-Apply' : 'Manual'} • ${record.note ? record.note.slice(0, 90) : 'No server note'}`,
        keywords: `server workspace focus theme performance quick ${record.note || ''} ${record.guildId}`,
        baseScore: 115,
        icon: '▦',
        actionLabel: 'Open',
        action: () => navigateToDiscordPath(openPath),
        secondaryLabel: record.snapshot ? 'Apply' : '',
        secondaryAction: record.snapshot
          ? () => applyServerWorkspaceRecord(record)
          : null
      }));

      for (const channel of Object.values(record.quickChannels || {})) {
        if (!channel?.path) continue;

        results.push(smartSearchResult({
          id: `server-quick:${record.guildId}:${channel.key}`,
          type: 'Server Quick Channel',
          category: 'navigation',
          title: channel.channelName || `Channel ${String(channel.channelId || '').slice(-6)}`,
          subtitle: `${record.serverName || 'Server'} • Quick channel${record.startChannel?.key === channel.key ? ' • Start channel' : ''}`,
          keywords: `server shortcut quick channel ${record.serverName || ''} ${channel.channelId || ''}`,
          baseScore: 105,
          icon: '↗',
          actionLabel: 'Jump',
          action: () => navigateToDiscordPath(channel.path)
        }));
      }
    }

    // Pinned Servers.
    for (const server of Object.values(navData.serverFavorites || {})) {
      if (!server?.guildId || !server?.path) continue;

      results.push(smartSearchResult({
        id: `server:${server.guildId}`,
        type: 'Server',
        category: 'navigation',
        title: server.serverName || `Server ${String(server.guildId).slice(-6)}`,
        subtitle: `Pinned server • ${server.guildId}`,
        keywords: `server guild pinned favorite ${server.guildId}`,
        baseScore: 100,
        icon: '◈',
        actionLabel: 'Jump',
        action: () => navigateToDiscordPath(server.path),
        secondaryLabel: 'Copy ID',
        secondaryAction: () => copyText(server.guildId)
      }));
    }

    // Pinned Channels.
    for (const channel of Object.values(navData.favorites || {})) {
      if (!channel?.key || !channel?.path) continue;

      results.push(smartSearchResult({
        id: `channel:${channel.key}`,
        type: 'Channel',
        category: 'navigation',
        title: channel.channelName || `Channel ${String(channel.channelId || '').slice(-6)}`,
        subtitle: `${channel.serverName || 'Discord'} • Pinned channel`,
        keywords: `channel pinned favorite ${channel.channelId || ''} ${channel.guildId || ''}`,
        baseScore: 110,
        icon: '#',
        actionLabel: 'Jump',
        action: () => navigateToDiscordPath(channel.path),
        secondaryLabel: 'Copy Link',
        secondaryAction: () => copyText(`${location.origin}${channel.path}`)
      }));
    }

    // Recent Channels.
    for (const channel of navData.recent || []) {
      if (!channel?.key || !channel?.path) continue;

      results.push(smartSearchResult({
        id: `recent:${channel.key}`,
        type: 'Recent',
        category: 'navigation',
        title: channel.channelName || `Channel ${String(channel.channelId || '').slice(-6)}`,
        subtitle: `${channel.serverName || 'Discord'} • Recent channel`,
        keywords: `recent history channel ${channel.channelId || ''} ${channel.guildId || ''}`,
        baseScore: 70,
        icon: '↺',
        actionLabel: 'Jump',
        action: () => navigateToDiscordPath(channel.path)
      }));
    }

    // Channel Notes.
    for (const [key, note] of Object.entries(navData.notes || {})) {
      const value = String(note || '').trim();
      if (!value) continue;

      const channel = smartSearchChannelRecordForKey(key);
      if (!channel?.path) continue;

      results.push(smartSearchResult({
        id: `note:${key}`,
        type: 'Channel Note',
        category: 'notes',
        title: channel.channelName || 'Channel Note',
        subtitle: `${channel.serverName || 'Discord'} • ${value.slice(0, 120)}`,
        keywords: `note channel ${value}`,
        baseScore: 90,
        icon: '✎',
        actionLabel: 'Jump',
        action: () => navigateToDiscordPath(channel.path),
        secondaryLabel: 'Copy Note',
        secondaryAction: () => copyText(value)
      }));
    }

    // Saved Messages.
    for (const message of Object.values(messageData.saved || {})) {
      if (!message?.key) continue;

      const excerpt = cleanLabel(
        message.text,
        '[attachment/embed]'
      ).slice(0, 140);

      results.push(smartSearchResult({
        id: `message:${message.key}`,
        type: 'Saved Message',
        category: 'messages',
        title: message.author && message.author !== 'Unknown author'
          ? message.author
          : 'Saved Message',
        subtitle: `${message.serverName || 'Discord'} / ${message.channelName || 'Channel'} • ${excerpt}`,
        keywords: `message saved ${message.text || ''} ${message.messageId || ''}`,
        baseScore: 92,
        icon: '▤',
        actionLabel: 'Jump',
        action: () => {
          if (message.path) navigateToDiscordPath(message.path);
          else if (message.link) {
            try {
              navigateToDiscordPath(new URL(message.link).pathname);
            } catch {
              toast('Message link unavailable');
            }
          } else {
            toast('Message link unavailable');
          }
        },
        secondaryLabel: 'Copy',
        secondaryAction: () => copyText(message.text || message.link || '')
      }));
    }

    // Media Bookmarks.
    for (const media of Object.values(mediaData.saved || {})) {
      if (!media?.key || !media?.url) continue;

      results.push(smartSearchResult({
        id: `media:${media.key}`,
        type: 'Media',
        category: 'media',
        title: media.filename || 'Saved Media',
        subtitle: `${String(media.type || 'file').toUpperCase()} • ${media.serverName || 'Discord'} / ${media.channelName || 'Channel'}`,
        keywords: `media bookmark attachment ${media.filename || ''} ${media.type || ''} ${media.author || ''}`,
        baseScore: 80,
        icon: '▣',
        actionLabel: 'Open',
        action: () => openMediaUrl(media.url),
        secondaryLabel: media.messageLink ? 'Source' : 'Copy URL',
        secondaryAction: () => {
          if (media.messageLink) {
            try {
              navigateToDiscordPath(new URL(media.messageLink).pathname);
            } catch {
              copyText(media.url);
            }
          } else {
            copyText(media.url);
          }
        }
      }));
    }

    return results;
  }

  function smartSearchFilterMatches(result, filter) {
    if (!filter || filter === 'all') return true;
    return result.category === filter;
  }

  function runSmartSearch(query, filter = smartSearchCurrentFilter) {
    const index = buildSmartSearchIndex();
    const scored = [];

    for (const result of index) {
      if (!smartSearchFilterMatches(result, filter)) continue;

      const score = smartSearchScore(result, query);
      if (score < 0) continue;

      scored.push({
        ...result,
        score
      });
    }

    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.title.localeCompare(b.title);
    });

    smartSearchLastResults = scored.slice(0, smartSearchData.resultLimit);
    return smartSearchLastResults;
  }

  function smartSearchCategoryCounts() {
    const index = buildSmartSearchIndex();
    const counts = {
      all: index.length,
      navigation: 0,
      notes: 0,
      messages: 0,
      media: 0,
      workspaces: 0
    };

    for (const item of index) {
      if (item.category in counts) counts[item.category] += 1;
    }

    return counts;
  }

  function executeSmartSearchResult(result, remember = true) {
    if (!result || typeof result.action !== 'function') return;

    if (remember && smartSearchInputRef) {
      smartSearchRememberQuery(smartSearchInputRef.value);
    }

    try {
      result.action();
    } catch {
      toast('Could not open search result');
    }
  }

  function smartSearchResultNode(result, index) {
    const primary = button(
      result.actionLabel || 'Open',
      () => executeSmartSearchResult(result)
    );
    primary.classList.add('dpt-nav-mini');

    const actions = [primary];

    if (
      result.secondaryLabel
      && typeof result.secondaryAction === 'function'
    ) {
      const secondary = button(
        result.secondaryLabel,
        () => {
          try {
            result.secondaryAction();
          } catch {
            toast('Search action unavailable');
          }
        }
      );
      secondary.classList.add('dpt-nav-mini');
      actions.push(secondary);
    }

    const node = el('div', {
      class: 'dpt-smart-result',
      'data-smart-result-index': String(index)
    }, [
      el('div', { class: 'dpt-smart-result-icon', text: result.icon || '⌕' }),
      el('div', { class: 'dpt-smart-result-copy' }, [
        el('div', { class: 'dpt-smart-result-head' }, [
          el('span', { class: 'dpt-smart-result-title', text: result.title }),
          el('span', { class: 'dpt-smart-result-type', text: result.type })
        ]),
        el('div', {
          class: 'dpt-smart-result-sub',
          text: result.subtitle || ''
        })
      ]),
      el('div', { class: 'dpt-nav-actions' }, actions)
    ]);

    node.addEventListener('dblclick', event => {
      if (event.target.closest('button')) return;
      executeSmartSearchResult(result);
    });

    return node;
  }

  function smartSearchFilterButton(id, label, count) {
    const active = smartSearchCurrentFilter === id;

    const buttonNode = el('button', {
      type: 'button',
      class: `dpt-smart-filter${active ? ' active' : ''}`,
      text: `${label} ${count}`
    });

    buttonNode.addEventListener('click', () => {
      smartSearchCurrentFilter = id;
      renderSmartSearchCenter(smartSearchInputRef?.value || '');
    });

    return buttonNode;
  }

  function focusSmartSearchCenter(selectText = false) {
    if (!panel) return;

    panel.hidden = false;
    setDashboardTab('search', { scroll: false, instant: true });

    const input = panel.querySelector('[data-smart-search-input]');
    if (!input) return;

    input.focus();

    if (selectText) {
      input.select();
    }
  }

  function installSmartSearchShortcut() {
    document.addEventListener('keydown', event => {
      if (!smartSearchData.shortcutEnabled || !powerToolsActive()) return;
      if (!(event.altKey && event.shiftKey && event.key.toLowerCase() === 'j')) return;

      const target = event.target;
      const typing = target instanceof HTMLInputElement
        || target instanceof HTMLTextAreaElement
        || target?.isContentEditable;

      if (typing) return;

      event.preventDefault();
      focusSmartSearchCenter(true);
    }, true);
  }

  function renderSmartSearchCenter(forcedQuery = null) {
    const container = panel?.querySelector('[data-smart-search-center]');
    if (!container) return;

    const initialQuery = forcedQuery !== null
      ? String(forcedQuery)
      : (
          smartSearchInputRef?.value
          ?? (smartSearchData.rememberQuery ? smartSearchData.lastQuery : '')
        );

    const counts = smartSearchCategoryCounts();

    const status = el('div', { class: 'dpt-smart-status' }, [
      el('div', {}, [
        el('div', {
          class: 'dpt-smart-status-title',
          text: 'Smart Search & Jump'
        }),
        el('div', {
          class: 'dpt-smart-status-sub',
          text: `${counts.all} local items indexed • Alt+Shift+J opens search`
        })
      ]),
      el('span', {
        class: 'dpt-workspace-count',
        text: 'LOCAL INDEX'
      })
    ]);

    const searchInput = el('input', {
      class: 'dpt-smart-input',
      type: 'search',
      placeholder: 'Search servers, channels, notes, messages, media, workspaces…',
      autocomplete: 'off',
      spellcheck: 'false',
      'data-smart-search-input': '1'
    });
    searchInput.value = initialQuery;
    smartSearchInputRef = searchInput;

    const resultsWrap = el('div', { class: 'dpt-smart-results' });
    const meta = el('div', { class: 'dpt-smart-meta' });

    const refreshResults = () => {
      const query = searchInput.value;
      const results = runSmartSearch(query, smartSearchCurrentFilter);

      meta.textContent = `${results.length} result${results.length === 1 ? '' : 's'}${query ? ` for “${query.slice(0, 50)}”` : ''}`;

      if (!results.length) {
        resultsWrap.replaceChildren(
          el('div', {
            class: 'dpt-nav-empty',
            text: 'No matching local PowerTools items.'
          })
        );
        return;
      }

      resultsWrap.replaceChildren(
        ...results.map((result, index) => smartSearchResultNode(result, index))
      );
    };

    searchInput.addEventListener('input', () => {
      if (smartSearchData.rememberQuery) {
        smartSearchData.lastQuery = searchInput.value.slice(0, 160);
        saveSmartSearchData();
      }

      refreshResults();
    });

    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        const first = smartSearchLastResults[0];
        if (!first) return;

        event.preventDefault();
        smartSearchRememberQuery(searchInput.value);
        executeSmartSearchResult(first, false);
      }

      if (event.key === 'Escape') {
        if (searchInput.value) {
          event.preventDefault();
          searchInput.value = '';
          smartSearchData.lastQuery = '';
          saveSmartSearchData();
          refreshResults();
        }
      }
    });

    const filters = el('div', { class: 'dpt-smart-filters' }, [
      smartSearchFilterButton('all', 'All', counts.all),
      smartSearchFilterButton('navigation', 'Navigation', counts.navigation),
      smartSearchFilterButton('notes', 'Notes', counts.notes),
      smartSearchFilterButton('messages', 'Messages', counts.messages),
      smartSearchFilterButton('media', 'Media', counts.media),
      smartSearchFilterButton('workspaces', 'Workspaces', counts.workspaces)
    ]);

    const recentQueryNodes = smartSearchData.recentQueries.length
      ? smartSearchData.recentQueries.map(query => {
          const chip = el('button', {
            type: 'button',
            class: 'dpt-smart-query-chip',
            text: query
          });

          chip.addEventListener('click', () => {
            searchInput.value = query;
            refreshResults();
            searchInput.focus();
          });

          return chip;
        })
      : [
          el('span', {
            class: 'dpt-smart-query-empty',
            text: 'No recent searches yet.'
          })
        ];

    const recentQueries = el('div', { class: 'dpt-smart-recent-queries' }, recentQueryNodes);

    const settingsRow = el('div', { class: 'dpt-grid dpt-smart-tools' }, [
      button(
        smartSearchData.shortcutEnabled ? 'Shortcut ON' : 'Shortcut OFF',
        () => {
          smartSearchData.shortcutEnabled = !smartSearchData.shortcutEnabled;
          saveSmartSearchData();
          renderSmartSearchCenter(searchInput.value);
          toast(`Smart Search shortcut ${smartSearchData.shortcutEnabled ? 'enabled' : 'disabled'}`);
        }
      ),
      button(
        smartSearchData.rememberQuery ? 'Remember Query ON' : 'Remember Query OFF',
        () => {
          smartSearchData.rememberQuery = !smartSearchData.rememberQuery;

          if (!smartSearchData.rememberQuery) {
            smartSearchData.lastQuery = '';
          }

          saveSmartSearchData();
          renderSmartSearchCenter(searchInput.value);
        }
      ),
      button('Copy Search Index', () => {
        const exportIndex = buildSmartSearchIndex().map(item => ({
          type: item.type,
          category: item.category,
          title: item.title,
          subtitle: item.subtitle
        }));

        copyText(JSON.stringify(exportIndex, null, 2));
      }),
      button('Clear Search History', () => {
        smartSearchData.lastQuery = '';
        smartSearchData.recentQueries = [];
        saveSmartSearchData();
        renderSmartSearchCenter('');
        toast('Smart Search history cleared');
      }, true)
    ]);

    container.replaceChildren(
      status,
      searchInput,
      filters,
      meta,
      resultsWrap,
      el('div', { class: 'dpt-nav-divider' }),
      el('div', { class: 'dpt-nav-group-title', text: 'Recent Searches' }),
      recentQueries,
      settingsRow
    );

    refreshResults();
  }

  const DASHBOARD_TABS = [
    { id: 'core', title: 'Core', label: 'Core' },
    { id: 'workspaces', title: 'Workspace Profiles', label: 'Workspaces' },
    { id: 'search', title: 'Smart Search & Jump Center', label: 'Search' },
    { id: 'servers', title: 'Server & Channel PowerTools', label: 'Servers' },
    { id: 'messages', title: 'Message Utilities', label: 'Messages' },
    { id: 'media', title: 'Media & Attachment Tools', label: 'Media' },
    { id: 'focus', title: 'Focus & Productivity Center', label: 'Focus' },
    { id: 'nitro', title: 'Nitro Cosmetic Preview', label: 'Nitro' },
    { id: 'notifications', title: 'Notification Control', label: 'Alerts' },
    { id: 'privacy', title: 'Privacy & Tracking Control', label: 'Privacy' },
    { id: 'performance2', title: 'Performance+ 2.0', label: 'Perf 2.0' },
    { id: 'stable', title: 'Stable Release Center', label: 'Stable' },
    { id: 'themes', title: 'Theme Studio', label: 'Themes' },
    { id: 'interface', title: 'Interface Studio', label: 'Interface' },
    { id: 'performance', title: 'Performance+', label: 'Perf+' },
    { id: 'tools', title: 'Quick Tools', label: 'Tools' },
    { id: 'diagnostics', title: 'Live Diagnostics', label: 'Diagnostics' }
  ];

  function validDashboardTab(id) {
    return DASHBOARD_TABS.some(tab => tab.id === id);
  }

  function dashboardTabForSection(section) {
    const title = cleanLabel(
      section?.querySelector?.('.dpt-section-title')?.textContent
    );

    return DASHBOARD_TABS.find(tab => tab.title === title) || null;
  }

  function updateDashboardTabButtons() {
    if (!dashboardTabsElement) return;

    dashboardTabsElement
      .querySelectorAll('[data-dpt-tab-button]')
      .forEach(buttonNode => {
        const active = buttonNode.getAttribute('data-dpt-tab-button') === dashboardActiveTab;
        buttonNode.classList.toggle('active', active);
        buttonNode.setAttribute('aria-selected', active ? 'true' : 'false');
        buttonNode.tabIndex = active ? 0 : -1;

        if (active) {
          requestAnimationFrame(() => {
            try {
              buttonNode.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
              });
            } catch {}
          });
        }
      });
  }

  function setDashboardTab(id, options = {}) {
    if (!panel) return;

    const next = validDashboardTab(id) ? id : 'core';
    dashboardActiveTab = next;
    writeStoredValue(DASHBOARD_TAB_KEY, next);

    panel.querySelectorAll('.dpt-section[data-dpt-tab]').forEach(section => {
      const active = section.getAttribute('data-dpt-tab') === next;
      section.hidden = !active;
      section.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    updateDashboardTabButtons();

    if (options.scroll !== false) {
      try {
        panel.scrollTo({ top: 0, behavior: options.instant ? 'auto' : 'smooth' });
      } catch {
        panel.scrollTop = 0;
      }
    }

    // Refresh modules whose content can change while their tab was hidden.
    if (next === 'workspaces') safeRender('Workspace Profiles', renderWorkspaceProfiles);
    if (next === 'search') safeRender('Smart Search', renderSmartSearchCenter);
    if (next === 'servers') safeRender('Server Workspace+', renderServerChannelStudio);
    if (next === 'messages') safeRender('Message Utilities', renderMessageUtilities);
    if (next === 'media') safeRender('Media Center', renderMediaAttachmentTools);
    if (next === 'focus') safeRender('Focus Center', renderFocusProductivityCenter);
    if (next === 'nitro') safeRender('Nitro Preview', renderNitroCosmeticPreview);
    if (next === 'notifications') safeRender('Notification Control', renderNotificationControl);
    if (next === 'privacy') safeRender('Privacy Control', renderPrivacyTrackingControl);
    if (next === 'performance2') safeRender('Performance+ 2.0', renderPerformance2Center);
    if (next === 'stable') safeRender('Stable Release Center', renderStableReleaseCenter);

    if (next === 'diagnostics') updateStats();
  }

  function buildDashboardTabs() {
    if (!panel) return null;

    const existing = panel.querySelector('.dpt-tabs');
    if (existing) {
      dashboardTabsElement = existing;
      return existing;
    }

    const sections = [...panel.querySelectorAll('.dpt-section')];

    for (const section of sections) {
      const tab = dashboardTabForSection(section);

      if (!tab) {
        section.hidden = false;
        continue;
      }

      section.setAttribute('data-dpt-tab', tab.id);
      section.id = `dpt-tabpanel-${tab.id}`;
      section.setAttribute('aria-labelledby', `dpt-tab-${tab.id}`);
      section.setAttribute('role', 'tabpanel');
      section.setAttribute('aria-label', tab.title);
    }

    const tabs = el('div', {
      class: 'dpt-tabs',
      role: 'tablist',
      'aria-label': 'Discord PowerTools sections'
    });

    tabs.addEventListener('wheel', event => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

      const canScroll = tabs.scrollWidth > tabs.clientWidth + 2;
      if (!canScroll) return;

      event.preventDefault();
      tabs.scrollLeft += event.deltaY;
    }, { passive: false });

    for (const tab of DASHBOARD_TABS) {
      const buttonNode = el('button', {
        type: 'button',
        class: 'dpt-tab-button',
        role: 'tab',
        id: `dpt-tab-${tab.id}`,
        'aria-controls': `dpt-tabpanel-${tab.id}`,
        title: tab.title,
        text: tab.label,
        'data-dpt-tab-button': tab.id,
        'aria-selected': 'false'
      });

      buttonNode.addEventListener('click', () => {
        setDashboardTab(tab.id);
      });

      buttonNode.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

        event.preventDefault();

        const currentIndex = DASHBOARD_TABS.findIndex(item => item.id === dashboardActiveTab);
        let nextIndex = currentIndex;

        if (event.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + DASHBOARD_TABS.length) % DASHBOARD_TABS.length;
        } else if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % DASHBOARD_TABS.length;
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = DASHBOARD_TABS.length - 1;
        }

        const nextTab = DASHBOARD_TABS[nextIndex];
        setDashboardTab(nextTab.id);

        requestAnimationFrame(() => {
          dashboardTabsElement
            ?.querySelector(`[data-dpt-tab-button="${nextTab.id}"]`)
            ?.focus();
        });
      });

      tabs.appendChild(buttonNode);
    }

    const head = panel.querySelector('.dpt-head');
    head?.insertAdjacentElement('afterend', tabs);

    dashboardTabsElement = tabs;

    if (!validDashboardTab(dashboardActiveTab)) {
      dashboardActiveTab = 'core';
    }

    setDashboardTab(dashboardActiveTab, {
      scroll: false,
      instant: true
    });

    return tabs;
  }

  function isValidThemeId(value) {
    return typeof value === 'string'
      && Object.prototype.hasOwnProperty.call(THEME_PRESETS, value);
  }

  function readGMSetting(key, fallback = null) {
    try {
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(key, undefined);
        return value === undefined ? fallback : value;
      }
    } catch {}
    return fallback;
  }

  function writeGMSetting(key, value) {
    try {
      if (typeof GM_setValue === 'function') {
        GM_setValue(key, value);
        return true;
      }
    } catch {}
    return false;
  }

  function readLegacyLocal(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? null : JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function migrateSettingsV3() {
    const oldGM = readGMSetting(STORAGE_KEY, null);
    const oldLocal = readLegacyLocal(STORAGE_KEY);

    const migrated = {
      ...defaults,
      ...(oldLocal && typeof oldLocal === 'object' ? oldLocal : {}),
      ...(oldGM && typeof oldGM === 'object' ? oldGM : {})
    };

    // Recover the last intended theme only during this one-time migration.
    // After settingsV3 exists, legacy keys are NEVER consulted again.
    const v2GM = readGMSetting(LEGACY_THEME_STATE_KEY, null);
    const v2Local = readLegacyLocal(LEGACY_THEME_STATE_KEY);
    const activeGM = readGMSetting(LEGACY_THEME_KEY, null);
    const activeLocal = readLegacyLocal(LEGACY_THEME_KEY);

    const themeCandidates = [
      v2GM?.id,
      v2Local?.id,
      activeGM,
      activeLocal,
      migrated.uiTheme
    ];

    const recoveredTheme = themeCandidates.find(isValidThemeId);
    migrated.uiTheme = recoveredTheme || defaults.uiTheme;

    // Validate migrated interface numbers.
    migrated.panelWidth = Math.max(320, Math.min(460, Number(migrated.panelWidth || defaults.panelWidth)));
    migrated.panelOpacity = Math.max(75, Math.min(100, Number(migrated.panelOpacity || defaults.panelOpacity)));
    migrated.launcherSize = Math.max(42, Math.min(76, Number(migrated.launcherSize || defaults.launcherSize)));

    const validFpsPositions = new Set(['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-left']);
    if (!validFpsPositions.has(migrated.fpsPosition)) {
      migrated.fpsPosition = defaults.fpsPosition;
    }

    writeStoredValue(SETTINGS_V3_KEY, normalizeSettings(migrated));
    return migrated;
  }

  function finiteNumber(value, fallback = 0) {
    const number = Number(value);
    return value != null && Number.isFinite(number) ? number : fallback;
  }

  function normalizeSettings(value) {
    const data = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const result = { ...defaults };
    for (const [key, fallback] of Object.entries(defaults)) {
      if (typeof fallback === 'boolean' && typeof data[key] === 'boolean') result[key] = data[key];
    }
    for (const [key, min, max] of [['panelWidth', 320, 460], ['panelOpacity', 75, 100], ['launcherSize', 42, 76]]) {
      const number = Number(data[key]);
      if (data[key] != null && Number.isFinite(number)) result[key] = Math.max(min, Math.min(max, number));
    }
    if (isValidThemeId(data.uiTheme)) result.uiTheme = data.uiTheme;
    if (['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-left'].includes(data.fpsPosition)) {
      result.fpsPosition = data.fpsPosition;
    }
    return result;
  }

  function loadSettings() {
    const stored = readStoredValue(SETTINGS_V3_KEY, null);
    return normalizeSettings(stored || migrateSettingsV3());
  }

  function saveSettings() {
    settings = normalizeSettings(settings);
    return writeStoredValue(SETTINGS_V3_KEY, { ...settings });
  }

  function setSetting(key, value) {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) return;
    if (key === 'uiTheme' && !isValidThemeId(value)) return;

    settings[key] = value;
    saveSettings();

    // Theme selection itself only updates CSS variables. No timers, no
    // navigation hooks, no duplicate state, no style-tag churn.
    if (key === 'uiTheme') {
      applyThemeVariables();
      updateUI();
      return;
    }

    applySettings();
    updateUI();
  }

  function cssText() {
    if (!settings.enabled) return '';

    const rules = [];

    if (settings.performancePlus) {
      rules.push(`
        html[data-discord-powertools="1"] * {
          scroll-behavior: auto !important;
        }
      `);
    }

    if (settings.reducedMotion) {
      rules.push(`
        /* Overlay-safe Reduced Motion: optimize persistent Discord content,
           never the floating command/menu/dialog layer. */
        html[data-discord-powertools="1"] [data-list-item-id^="chat-messages___"] *,
        html[data-discord-powertools="1"] nav[aria-label="Servers"] *,
        html[data-discord-powertools="1"] [role="navigation"] * {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
          transition-delay: 0ms !important;
        }
      `);
    }

    if (settings.disableBlur) {
      rules.push(`
        /* Only message-content effects are eligible. Discord's floating UI
           (slash-command picker, menus, dialogs, autocomplete, tooltips)
           is intentionally excluded from performance styling. */
        html[data-discord-powertools="1"]
        [data-list-item-id^="chat-messages___"] [style*="backdrop-filter"],
        html[data-discord-powertools="1"]
        [data-list-item-id^="chat-messages___"] [class*="blur"],
        html[data-discord-powertools="1"]
        [data-list-item-id^="chat-messages___"] [class*="backdrop"] {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          filter: none !important;
        }
      `);
    }

    if (settings.lighterShadows) {
      rules.push(`
        /* Message-content shadows only. Modal/popout/menu shadows remain
           Discord-native so visual stacking and readability stay correct. */
        html[data-discord-powertools="1"]
        [data-list-item-id^="chat-messages___"] [class*="shadow"] {
          box-shadow: none !important;
        }
      `);
    }

    if (settings.compactEffects) {
      rules.push(`
        /* Decorative effects are suppressed only inside persistent message
           content. Floating interaction layers remain untouched. */
        html[data-discord-powertools="1"]
        [data-list-item-id^="chat-messages___"] [class*="sparkle"],
        html[data-discord-powertools="1"]
        [data-list-item-id^="chat-messages___"] [class*="shimmer"],
        html[data-discord-powertools="1"]
        [data-list-item-id^="chat-messages___"] [class*="pulse"] {
          animation: none !important;
        }
      `);
    }

    if (settings.imageRendering) {
      rules.push(`
        html[data-discord-powertools="1"] img {
          image-rendering: auto;
        }
      `);
    }


    rules.push(`
      html[data-dpt-discord-theme="1"],
      html[data-dpt-discord-theme="1"] body,
      html[data-dpt-discord-theme="1"] #app-mount {
        --brand-500: var(--dpt-accent) !important;
        --brand-560: var(--dpt-accent-2) !important;
        --brand-experiment: var(--dpt-accent) !important;
        --text-link: var(--dpt-accent) !important;

        --background-primary: var(--dpt-solid-surface) !important;
        --background-secondary: var(--dpt-solid-header) !important;
        --background-secondary-alt: var(--dpt-solid-surface-2) !important;
        --background-tertiary: var(--dpt-solid-bg) !important;
        --background-floating: var(--dpt-solid-surface-2) !important;
        --channeltextarea-background: var(--dpt-solid-surface-2) !important;
        --input-background: var(--dpt-solid-surface-2) !important;
        --modal-background: var(--dpt-solid-surface) !important;
        --modal-footer-background: var(--dpt-solid-header) !important;

        --background-base-lowest: var(--dpt-solid-bg) !important;
        --background-base-lower: var(--dpt-solid-header) !important;
        --background-base-low: var(--dpt-solid-surface) !important;
        --background-surface-high: var(--dpt-solid-surface-2) !important;
        --background-surface-higher: var(--dpt-solid-surface-2) !important;
        --background-surface-highest: var(--dpt-solid-surface-2) !important;

        --bg-base-primary: var(--dpt-solid-surface) !important;
        --bg-base-secondary: var(--dpt-solid-header) !important;
        --bg-base-tertiary: var(--dpt-solid-bg) !important;

        --background-modifier-hover: var(--dpt-theme-hover) !important;
        --background-modifier-active: var(--dpt-theme-active) !important;
        --background-modifier-selected: var(--dpt-theme-selected) !important;
      }
    `);

    return rules.join('\n');
  }

  function installStyle() {
    let style = document.getElementById('discord-powertools-performance-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'discord-powertools-performance-style';
      (document.head || document.documentElement).appendChild(style);
    }

    const nextCSS = cssText();
    if (style.textContent !== nextCSS) style.textContent = nextCSS;
  }

  function applyMediaHints(root = document) {
    const coreEnabled = powerToolsActive() && settings.performancePlus;
    const perf2Enabled = effectivePerformance2();
    if (!coreEnabled && !perf2Enabled) return;
    const media = [...(root.querySelectorAll?.('img,video') || [])];
    if (root.matches?.('img,video')) media.unshift(root);
    for (const item of media) {
      if (!item.closest?.('[id^="chat-messages"],[data-list-item-id^="chat-messages"]')) continue;
      if (item.closest('[role="dialog"],[role="menu"],[role="listbox"],[role="tooltip"],#dpt-panel')) continue;
      try {
        if (item.tagName === 'VIDEO') {
          if (coreEnabled && !item.hasAttribute('preload')) item.preload = 'metadata';
          continue;
        }
        const width = Number(item.naturalWidth || item.width || 0);
        const height = Number(item.naturalHeight || item.height || 0);
        if (width && height && width <= 64 && height <= 64) continue;
        let changed = 0;
        if ((coreEnabled || performance2.asyncImageDecode) && !item.hasAttribute('decoding')) {
          item.decoding = 'async';
          changed++;
        }
        if (perf2Enabled && performance2.lazyMediaHints && !item.hasAttribute('loading')) {
          item.loading = 'lazy';
          changed++;
        }
        if (changed && perf2Enabled) {
          performance2.imageOptimizedCount += changed;
          perf2HintStateDirty = true;
        }
      } catch {}
    }
  }

  let observerQueued = false;
  const pendingMediaRoots = new Set();
  const observer = new MutationObserver(mutations => {
    if (effectivePerformance2()) {
      perf2MutationCount += mutations.length;
      perf2DomDirty = true;
    }
    if (effectiveFocusMode() && focusData.hideActivity) scheduleFocusActivityPanelScan(false);
    if (!powerToolsActive() || (!settings.performancePlus && !effectivePerformance2())) return;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && !node.closest?.('#dpt-panel,#dpt-launcher')) pendingMediaRoots.add(node);
      }
    }
    // Bound retained detached nodes during unusually busy channel updates.
    if (pendingMediaRoots.size > 250) {
      pendingMediaRoots.clear();
      pendingMediaRoots.add(document);
    }
    if (observerQueued || !pendingMediaRoots.size) return;
    observerQueued = true;
    const run = () => {
      observerQueued = false;
      const roots = [...pendingMediaRoots];
      pendingMediaRoots.clear();
      for (const node of roots) if (node === document || node.isConnected) applyMediaHints(node);
    };
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 600 });
    else setTimeout(run, 120);
  });

  function startObserver() {
    if (!document.documentElement) return;
    observer.disconnect();

    const focusNeedsObserver = effectiveFocusMode() && focusData.hideActivity;

    if (
      powerToolsActive()
      && (
        settings.performancePlus
        || performance2?.enabled
        || focusNeedsObserver
      )
    ) {
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  }

  function getTheme() {
    return THEME_PRESETS[settings.uiTheme] || THEME_PRESETS['purple-dragon'];
  }

  function hexToRgba(hex, alpha = 1) {
    const clean = String(hex || '').replace('#', '').trim();
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return `rgba(17,18,20,${alpha})`;

    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function applyThemeVariables() {
    if (!document.documentElement) return;

    const root = document.documentElement;
    const theme = getTheme();
    const opacity = Math.max(0.75, Math.min(1, Number(settings.panelOpacity || 96) / 100));

    root.style.setProperty('--dpt-accent', theme.accent);
    root.style.setProperty('--dpt-accent-2', theme.accent2);

    root.style.setProperty('--dpt-bg', hexToRgba(theme.bg, opacity));
    root.style.setProperty('--dpt-header', hexToRgba(theme.header, Math.min(1, opacity + 0.02)));
    root.style.setProperty('--dpt-surface', hexToRgba(theme.surface, Math.min(1, opacity + 0.01)));
    root.style.setProperty('--dpt-surface-2', hexToRgba(theme.surface2, Math.min(1, opacity + 0.01)));

    root.style.setProperty('--dpt-solid-bg', theme.bg);
    root.style.setProperty('--dpt-solid-header', theme.header);
    root.style.setProperty('--dpt-solid-surface', theme.surface);
    root.style.setProperty('--dpt-solid-surface-2', theme.surface2);

    root.style.setProperty('--dpt-text', theme.text);
    root.style.setProperty('--dpt-muted', theme.muted);
    root.style.setProperty('--dpt-border', hexToRgba(theme.border, 0.42));
    root.style.setProperty('--dpt-border-strong', hexToRgba(theme.border, 0.74));
    root.style.setProperty('--dpt-accent-soft', hexToRgba(theme.accent, 0.18));
    root.style.setProperty('--dpt-accent-glow', hexToRgba(theme.accent, 0.34));

    root.style.setProperty('--dpt-theme-hover', hexToRgba(theme.accent, 0.10));
    root.style.setProperty('--dpt-theme-active', hexToRgba(theme.accent, 0.14));
    root.style.setProperty('--dpt-theme-selected', hexToRgba(theme.accent, 0.18));

    root.style.setProperty(
      '--dpt-panel-width',
      `${Math.max(320, Math.min(460, Number(settings.panelWidth || 360)))}px`
    );

    root.style.setProperty(
      '--dpt-launcher-size',
      `${Math.max(42, Math.min(76, Number(settings.launcherSize || 54)))}px`
    );

    root.setAttribute('data-dpt-theme', settings.uiTheme);
    root.setAttribute('data-dpt-discord-theme', powerToolsActive() && !stableSafeModeActive() && settings.themeDiscord ? '1' : '0');
    root.setAttribute('data-dpt-compact', settings.compactPanel ? '1' : '0');
    root.setAttribute('data-dpt-launcher-glow', settings.launcherGlow ? '1' : '0');
    root.setAttribute('data-dpt-fps-position', settings.fpsPosition || 'top-right');
  }

  function applySettings() {
    const root = document.documentElement;
    if (!root) return;

    root.setAttribute('data-discord-powertools', powerToolsActive() ? '1' : '0');
    applyThemeVariables();
    installStyle();
    startObserver();
    applyMediaHints();

    if (powerToolsActive() && settings.fpsMeter) startFPS();
    else stopFPS();

    // The master switch is authoritative for every effect module.
    applyFocusState();
    applyNitroCosmeticState();
    applyNotificationControlState();
    applyPrivacyState();
    applyPerformance2State();
  }

  function ensureFPSBadge() {
    if (!document.body) return null;

    if (!fpsBadge || !document.documentElement.contains(fpsBadge)) {
      fpsBadge = document.getElementById('dpt-fps-badge');
      if (!fpsBadge) {
        fpsBadge = el('div', { id: 'dpt-fps-badge', text: 'FPS: —' });
        document.body.appendChild(fpsBadge);
      }
    }

    fpsBadge.hidden = !(settings.enabled && settings.fpsMeter);
    return fpsBadge;
  }

  function publishFPS(forceText = null) {
    const badge = ensureFPSBadge();

    if (!settings.enabled || !settings.fpsMeter) {
      if (badge) badge.hidden = true;
      return;
    }

    const text = forceText || `FPS: ${fpsValue || '—'}${fpsPeak ? `  •  Peak: ${fpsPeak}` : ''}`;
    if (badge) {
      badge.hidden = false;
      badge.textContent = text;
      badge.title = `Actual browser render cadence. No 60 FPS clamp is applied by PowerTools. Position: ${settings.fpsPosition === 'top-center' ? 'Top Center / Discord Header' : settings.fpsPosition}.`;
    }
    updateStats();
  }

  function startFPS() {
    ensureFPSBadge();

    if (!settings.enabled || !settings.fpsMeter) {
      stopFPS();
      return;
    }

    if (fpsHandle) {
      publishFPS();
      return;
    }

    fpsPrevFrame = 0;
    fpsLastPublish = performance.now();
    fpsSamples = [];
    publishFPS('FPS: starting…');

    const tick = now => {
      if (!settings.enabled || !settings.fpsMeter) {
        fpsHandle = 0;
        return;
      }

      if (document.hidden) {
        fpsPrevFrame = now;
        fpsSamples = [];
        publishFPS('FPS: paused');
        fpsHandle = requestAnimationFrame(tick);
        return;
      }

      if (fpsPrevFrame > 0) {
        const delta = now - fpsPrevFrame;

        // Ignore giant gaps caused by tab suspension/debugger pauses.
        if (delta > 0 && delta < 250) {
          const instantFPS = 1000 / delta;
          fpsSamples.push(instantFPS);
          if (fpsSamples.length > 45) fpsSamples.shift();
        }
      }

      fpsPrevFrame = now;

      // Publish twice per second. Median/trimmed-style averaging is steadier on Discord.
      if (now - fpsLastPublish >= 500) {
        if (fpsSamples.length) {
          const sorted = [...fpsSamples].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          const medianFPS = sorted.length % 2
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;

          // Intentionally NO 60 FPS clamp.
          // If Chromium renders at 120/144/165/240 Hz, the meter can report it.
          fpsValue = Math.max(1, Math.round(medianFPS));
          fpsPeak = Math.max(fpsPeak, fpsValue);
        }

        fpsLastPublish = now;
        publishFPS();
      }

      fpsHandle = requestAnimationFrame(tick);
    };

    fpsHandle = requestAnimationFrame(tick);
  }

  function stopFPS() {
    if (fpsHandle) cancelAnimationFrame(fpsHandle);
    fpsHandle = 0;
    fpsPrevFrame = 0;
    fpsLastPublish = 0;
    fpsSamples = [];
    fpsValue = 0;
    fpsPeak = 0;

    const badge = fpsBadge || document.getElementById('dpt-fps-badge');
    if (badge) {
      badge.hidden = true;
      badge.textContent = 'FPS: —';
    }

    updateStats();
  }

  function formatMemory() {
    try {
      const mem = performance.memory;
      if (!mem?.usedJSHeapSize) return 'N/A';
      return `${(mem.usedJSHeapSize / 1048576).toFixed(0)} MB`;
    } catch {
      return 'N/A';
    }
  }

  function updateStats() {
    if (!panel) return;
    const dom = panel.querySelector('[data-stat="dom"]');
    const mem = panel.querySelector('[data-stat="mem"]');
    const fps = panel.querySelector('[data-stat="fps"]');

    if (dom) dom.textContent = currentPerformance2DomNodes(false).toLocaleString();
    if (mem) mem.textContent = formatMemory();
    if (fps) fps.textContent = settings.fpsMeter ? `${fpsValue || '—'} FPS` : 'Off';
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);

    for (const [key, value] of Object.entries(attrs || {})) {
      if (value == null || value === false) continue;

      if (key === 'class') {
        node.className = String(value);
      } else if (key === 'text') {
        node.textContent = String(value);
      } else if (key === 'style' && value && typeof value === 'object') {
        Object.assign(node.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        node.addEventListener(key.slice(2), value);
      } else if (key === 'disabled' || key === 'checked' || key === 'selected' || key === 'hidden') {
        node[key] = value === true || value === key || value === 'hidden';
      } else {
        node.setAttribute(key, value === true ? '' : String(value));
      }
    }

    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      node.appendChild(
        typeof child === 'string' || typeof child === 'number'
          ? document.createTextNode(String(child))
          : child
      );
    }

    return node;
  }

  function toggleRow(label, key, note) {
    const checkbox = el('input', { type: 'checkbox' });
    checkbox.checked = !!settings[key];
    checkbox.addEventListener('change', () => setSetting(key, checkbox.checked));

    const text = el('div', { class: 'dpt-row-text' }, [
      el('div', { class: 'dpt-row-title', text: label }),
      el('div', { class: 'dpt-row-note', text: note })
    ]);

    const switchWrap = el('label', { class: 'dpt-switch' }, [
      checkbox,
      el('span', { class: 'dpt-slider' })
    ]);

    const row = el('div', { class: 'dpt-row' }, [text, switchWrap]);
    row.dataset.setting = key;
    return row;
  }

  function themePicker() {
    const wrap = el('div', { class: 'dpt-theme-grid' });

    for (const [id, theme] of Object.entries(THEME_PRESETS)) {
      const chip = el('button', {
        class: 'dpt-theme-chip',
        type: 'button',
        title: `Use ${theme.name}`
      }, [
        el('span', {
          class: 'dpt-theme-dot',
          style: `--chip:${theme.accent};--chip2:${theme.accent2}`
        }),
        el('span', { text: theme.name })
      ]);

      chip.dataset.themeId = id;

      chip.addEventListener('click', () => {
        setSetting('uiTheme', id);
        toast(`${theme.name} saved`);
      });

      wrap.appendChild(chip);
    }

    return wrap;
  }

  function rangeRow(label, key, min, max, step, suffix, note) {
    const input = el('input', {
      class: 'dpt-range',
      type: 'range',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(settings[key])
    });

    input.dataset.rangeSetting = key;

    const value = el('span', {
      class: 'dpt-range-value',
      text: `${settings[key]}${suffix}`
    });
    value.dataset.rangeValue = key;
    value.dataset.suffix = suffix;

    input.addEventListener('input', () => {
      settings[key] = Number(input.value);
      saveSettings();
      applyThemeVariables();
      value.textContent = `${settings[key]}${suffix}`;

      if (key === 'panelWidth') clampPanelToViewport();
      if (key === 'launcherSize') clampLauncherToViewport();
    });

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-control-head' }, [
        el('span', { class: 'dpt-row-title', text: label }),
        value
      ]),
      input,
      el('div', { class: 'dpt-row-note', text: note })
    ]);
  }

  function selectRow(label, key, options, note) {
    const select = el('select', { class: 'dpt-select' });
    select.dataset.selectSetting = key;

    for (const [value, name] of options) {
      const option = el('option', { value, text: name });
      if (settings[key] === value) option.selected = true;
      select.appendChild(option);
    }

    select.addEventListener('change', () => setSetting(key, select.value));

    return el('div', { class: 'dpt-control-block' }, [
      el('div', { class: 'dpt-control-head' }, [
        el('span', { class: 'dpt-row-title', text: label }),
        select
      ]),
      el('div', { class: 'dpt-row-note', text: note })
    ]);
  }

  function resetThemeStudio() {
    settings.uiTheme = defaults.uiTheme;
    settings.themeDiscord = defaults.themeDiscord;
    settings.compactPanel = defaults.compactPanel;
    settings.panelWidth = defaults.panelWidth;
    settings.panelOpacity = defaults.panelOpacity;
    settings.launcherSize = defaults.launcherSize;
    settings.launcherGlow = defaults.launcherGlow;
    settings.fpsPosition = defaults.fpsPosition;

    saveSettings();
    applySettings();
    updateUI();
    restorePanelPosition();
    restoreLauncherPosition();
    toast('Theme Studio reset');
  }

  function button(text, onClick, danger = false, disabled = false) {
    const control = el('button', {
      class: `dpt-btn${danger ? ' danger' : ''}`,
      type: 'button',
      text,
      onclick: onClick
    });

    control.disabled = !!disabled;
    return control;
  }

  async function copyText(text) {
    const value = String(text ?? '');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        toast('Copied to clipboard');
        return true;
      }
    } catch {}

    try {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand('copy');
      ta.remove();

      if (!ok) throw new Error('Copy command failed');
      toast('Copied to clipboard');
      return true;
    } catch {
      toast('Clipboard copy failed');
      return false;
    }
  }

  function toast(message) {
    let t = document.getElementById('dpt-toast');
    if (!t) {
      t = el('div', { id: 'dpt-toast', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' });
      document.body.appendChild(t);
    }
    t.textContent = message;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 1400);
  }

  function savePanelPosition(x, y) {
    writeStoredValue(PANEL_KEY, { x, y });
  }

  function clampPanelToViewport() {
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const maxX = Math.max(8, window.innerWidth - Math.min(rect.width || 360, window.innerWidth - 16) - 8);
    const maxY = Math.max(8, window.innerHeight - 48);
    const x = Math.max(8, Math.min(maxX, Number.isFinite(rect.left) ? rect.left : 8));
    const y = Math.max(8, Math.min(maxY, Number.isFinite(rect.top) ? rect.top : 8));

    panel.style.left = `${x}px`;
    panel.style.top = `${y}px`;
    panel.style.right = 'auto';
  }

  function clampLauncherToViewport() {
    if (!launcher) return;

    const rect = launcher.getBoundingClientRect();
    const maxX = Math.max(8, window.innerWidth - launcher.offsetWidth - 8);
    const maxY = Math.max(8, window.innerHeight - launcher.offsetHeight - 8);
    const x = Math.max(8, Math.min(maxX, Number.isFinite(rect.left) ? rect.left : 8));
    const y = Math.max(8, Math.min(maxY, Number.isFinite(rect.top) ? rect.top : 8));

    launcher.style.left = `${x}px`;
    launcher.style.top = `${y}px`;
    launcher.style.right = 'auto';
    launcher.style.bottom = 'auto';
  }

  function restorePanelPosition() {
    try {
      const p = readStoredValue(PANEL_KEY, null);
      if (!panel) return;

      if (p && typeof p.x === 'number' && typeof p.y === 'number') {
        panel.style.left = `${p.x}px`;
        panel.style.top = `${p.y}px`;
        panel.style.right = 'auto';
      }

      clampPanelToViewport();
    } catch {}
  }

  function saveLauncherPosition(x, y) {
    writeStoredValue(LAUNCHER_KEY, { x, y });
  }

  function restoreLauncherPosition() {
    try {
      const p = readStoredValue(LAUNCHER_KEY, null);
      if (!launcher) return;

      if (p && typeof p.x === 'number' && typeof p.y === 'number') {
        launcher.style.left = `${p.x}px`;
        launcher.style.top = `${p.y}px`;
        launcher.style.right = 'auto';
        launcher.style.bottom = 'auto';
      }

      clampLauncherToViewport();
    } catch {}
  }

  function makeLauncherDraggable() {
    if (!launcher) return;

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;

    launcher.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;

      const r = launcher.getBoundingClientRect();
      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      offsetX = e.clientX - r.left;
      offsetY = e.clientY - r.top;

      launcher.setPointerCapture?.(e.pointerId);
      launcher.style.cursor = 'grabbing';
      e.preventDefault();
    });

    launcher.addEventListener('pointermove', e => {
      if (!dragging) return;

      if (!moved && Math.hypot(e.clientX - startX, e.clientY - startY) >= 4) {
        moved = true;
      }

      if (!moved) return;

      const maxX = Math.max(8, window.innerWidth - launcher.offsetWidth - 8);
      const maxY = Math.max(8, window.innerHeight - launcher.offsetHeight - 8);

      const x = Math.max(8, Math.min(maxX, e.clientX - offsetX));
      const y = Math.max(8, Math.min(maxY, e.clientY - offsetY));

      launcher.style.left = `${x}px`;
      launcher.style.top = `${y}px`;
      launcher.style.right = 'auto';
      launcher.style.bottom = 'auto';
    });

    const finish = e => {
      if (!dragging) return;

      dragging = false;
      launcher.style.cursor = 'grab';

      if (moved) {
        const r = launcher.getBoundingClientRect();
        saveLauncherPosition(r.left, r.top);

        // Suppress the click generated at the end of a drag.
        launcher.dataset.justDragged = '1';
        setTimeout(() => {
          if (launcher) delete launcher.dataset.justDragged;
        }, 120);
      }

      try {
        launcher.releasePointerCapture?.(e.pointerId);
      } catch {}
    };

    launcher.addEventListener('pointerup', finish);
    launcher.addEventListener('pointercancel', finish);

    window.addEventListener('resize', () => {
      clampLauncherToViewport();
      clampPanelToViewport();
    }, { passive: true });
  }

  function makeDraggable(handle) {
    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    handle.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      dragging = true;
      const r = panel.getBoundingClientRect();
      offsetX = e.clientX - r.left;
      offsetY = e.clientY - r.top;
      handle.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    });

    handle.addEventListener('pointermove', e => {
      if (!dragging) return;
      const x = Math.max(8, Math.min(window.innerWidth - panel.offsetWidth - 8, e.clientX - offsetX));
      const y = Math.max(8, Math.min(window.innerHeight - 48, e.clientY - offsetY));
      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      panel.style.right = 'auto';
    });

    const finish = () => {
      if (!dragging) return;
      dragging = false;
      const r = panel.getBoundingClientRect();
      savePanelPosition(r.left, r.top);
    };

    handle.addEventListener('pointerup', finish);
    handle.addEventListener('pointercancel', finish);
  }

  function injectUIStyle() {
    if (document.getElementById('discord-powertools-ui-style')) return;

    const style = el('style', { id: 'discord-powertools-ui-style' });

    style.textContent = `
      #dpt-launcher, #dpt-panel, #dpt-toast, #dpt-fps-badge {
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        box-sizing: border-box;
      }

      #dpt-fps-badge {
        position: fixed; z-index: 2147483646;
        min-width: 118px; padding: 8px 11px; border-radius: 11px;
        background: var(--dpt-bg, rgba(17,18,20,.96));
        color: var(--dpt-text, #fff);
        border: 1px solid var(--dpt-border, rgba(255,255,255,.13));
        box-shadow: 0 7px 18px rgba(0,0,0,.28);
        font-size: 12px; line-height: 1; font-weight: 800; text-align: center;
        pointer-events: none;
      }
      #dpt-fps-badge[hidden] { display: none !important; }
      html[data-dpt-fps-position="top-right"] #dpt-fps-badge { top:12px; right:14px; left:auto; bottom:auto; transform:none; }
      html[data-dpt-fps-position="top-center"] #dpt-fps-badge { top:12px; left:50%; right:auto; bottom:auto; transform:translateX(-50%); }
      html[data-dpt-fps-position="top-left"] #dpt-fps-badge { top:12px; left:14px; right:auto; bottom:auto; transform:none; }
      html[data-dpt-fps-position="bottom-right"] #dpt-fps-badge { bottom:14px; right:14px; left:auto; top:auto; transform:none; }
      html[data-dpt-fps-position="bottom-left"] #dpt-fps-badge { bottom:14px; left:14px; right:auto; top:auto; transform:none; }

      #dpt-launcher {
        position: fixed; left: 14px; top: 42%; z-index: 2147483646;
        width: var(--dpt-launcher-size,54px);
        height: var(--dpt-launcher-size,54px);
        padding:0;
        border:1px solid var(--dpt-border-strong,rgba(190,105,255,.72));
        border-radius:17px;
        background:var(--dpt-bg,#160c20);
        overflow:hidden;
        display:grid;
        place-items:center;
        box-shadow:0 8px 20px rgba(0,0,0,.34);
        cursor:grab;
        touch-action:none;
        user-select:none;
      }
      html[data-dpt-launcher-glow="1"] #dpt-launcher {
        box-shadow:
          0 8px 20px rgba(0,0,0,.35),
          0 0 18px var(--dpt-accent-glow,rgba(168,85,247,.34));
      }
      #dpt-launcher:hover { border-color:var(--dpt-accent,#a855f7); }
      #dpt-launcher .dpt-launcher-icon {
        width:100%; height:100%; display:block;
        object-fit:cover; object-position:center;
        border-radius:16px;
        pointer-events:none;
        user-select:none;
      }

      #dpt-panel {
        position:fixed; left:76px; top:14%; z-index:2147483647;
        width:var(--dpt-panel-width,360px);
        max-height:78vh;
        overflow-y:auto;
        overflow-x:hidden;
        background:var(--dpt-bg,#111214);
        color:var(--dpt-text,#fff);
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:18px;
        box-shadow:
          0 20px 52px rgba(0,0,0,.48),
          0 0 24px var(--dpt-accent-soft,rgba(168,85,247,.16));
      }
      #dpt-panel[hidden] { display:none !important; }
      #dpt-panel :focus-visible, #dpt-launcher:focus-visible {
        outline: 2px solid var(--dpt-accent, #a855f7);
        outline-offset: 3px;
      }
      #dpt-panel { max-width: calc(100vw - 16px); }
      @media (prefers-reduced-motion: reduce) {
        #dpt-panel *, #dpt-launcher, #dpt-toast {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      }

      .dpt-head {
        position:sticky; top:0; z-index:2;
        padding:14px 15px 12px;
        background:var(--dpt-header,#16171a);
        border-bottom:1px solid var(--dpt-border,rgba(255,255,255,.08));
        cursor:grab;
        user-select:none;
        border-radius:18px 18px 0 0;
      }
      .dpt-title { display:flex; justify-content:space-between; align-items:center; gap:10px; }
      .dpt-title strong { font-size:15px; color:var(--dpt-text,#fff); }
      .dpt-version { font-size:11px; color:var(--dpt-muted,#9ca3af); margin-top:2px; }
      .dpt-close {
        border:0; background:transparent; color:var(--dpt-muted,#aaa);
        font-size:20px; cursor:pointer; padding:3px 7px; border-radius:8px;
      }
      .dpt-close:hover { background:var(--dpt-surface,#232428); color:var(--dpt-text,#fff); }

      .dpt-tabs {
        position:sticky;
        top:67px;
        z-index:2;
        display:flex;
        gap:6px;
        overflow-x:auto;
        overflow-y:hidden;
        padding:8px 10px;
        max-width:100%;
        box-sizing:border-box;
        background:var(--dpt-header,#16171a);
        border-bottom:1px solid var(--dpt-border,rgba(255,255,255,.08));
        box-shadow:0 6px 14px rgba(0,0,0,.16);
        scrollbar-width:none;
        -ms-overflow-style:none;
        overscroll-behavior-x:contain;
        scroll-snap-type:x proximity;
      }
      .dpt-tabs::-webkit-scrollbar {
        display:none;
        width:0;
        height:0;
      }
      .dpt-tab-button {
        flex:0 0 auto;
        scroll-snap-align:center;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:9px;
        padding:7px 9px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-muted,#9ca3af);
        box-shadow:0 3px 8px rgba(0,0,0,.14);
        font:800 9px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.15px;
        cursor:pointer;
        white-space:nowrap;
      }
      .dpt-tab-button:hover {
        color:var(--dpt-text,#fff);
        border-color:var(--dpt-border-strong,rgba(168,85,247,.45));
        background:var(--dpt-theme-hover,rgba(255,255,255,.05));
      }
      .dpt-tab-button.active {
        color:var(--dpt-text,#fff);
        border-color:var(--dpt-accent,#a855f7);
        background:var(--dpt-theme-selected,rgba(168,85,247,.14));
        box-shadow:
          inset 0 0 0 1px var(--dpt-accent-soft,rgba(168,85,247,.12)),
          0 0 10px var(--dpt-accent-soft,rgba(168,85,247,.14));
      }
      .dpt-tab-button:focus-visible {
        outline:2px solid var(--dpt-accent,#a855f7);
        outline-offset:2px;
      }

      #dpt-panel .dpt-section[data-dpt-tab][hidden] {
        display:none !important;
      }

      .dpt-section {
        padding:13px 15px;
        border-bottom:1px solid var(--dpt-border,rgba(255,255,255,.07));
      }
      .dpt-section:last-child { border-bottom:0; }
      #dpt-panel .dpt-section[data-dpt-tab] {
        min-height:220px;
        overflow-x:hidden;
        border-bottom:0;
      }
      .dpt-section-title {
        font-size:11px; text-transform:uppercase; letter-spacing:.9px;
        color:var(--dpt-accent,#a855f7);
        margin-bottom:9px; font-weight:800;
      }

      .dpt-row {
        display:flex; align-items:center; justify-content:space-between;
        gap:12px; padding:8px 0;
      }
      .dpt-row-text { min-width:0; }
      .dpt-row-title { font-size:13px; font-weight:750; color:var(--dpt-text,#fff); }
      .dpt-row-note {
        font-size:11px; color:var(--dpt-muted,#9ca3af);
        margin-top:3px; line-height:1.35;
      }

      .dpt-switch { position:relative; width:40px; height:23px; flex:0 0 auto; }
      .dpt-switch input { opacity:0; width:0; height:0; }
      .dpt-slider {
        position:absolute; inset:0; border-radius:999px;
        background:var(--dpt-surface-2,#34363c); cursor:pointer;
        border:1px solid var(--dpt-border,transparent);
      }
      .dpt-slider:before {
        content:""; position:absolute; width:17px; height:17px; left:2px; top:2px;
        background:#fff; border-radius:50%;
        transition:transform .14s;
      }
      .dpt-switch input:checked + .dpt-slider {
        background:linear-gradient(135deg,var(--dpt-accent,#5865f2),var(--dpt-accent-2,#4752c4));
      }
      .dpt-switch input:checked + .dpt-slider:before { transform:translateX(17px); }

      .dpt-theme-grid {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:7px;
      }
      .dpt-theme-chip {
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        border-radius:11px;
        padding:8px 7px;
        cursor:pointer;
        display:flex;
        align-items:center;
        gap:6px;
        font-size:10.5px;
        font-weight:750;
      }
      .dpt-theme-chip:hover { border-color:var(--dpt-border-strong,#a855f7); }
      .dpt-theme-chip.active {
        border-color:var(--dpt-accent,#a855f7);
        box-shadow:0 0 0 1px var(--dpt-accent-soft,rgba(168,85,247,.18));
      }
      .dpt-theme-dot {
        width:13px; height:13px; border-radius:50%; flex:0 0 auto;
        background:linear-gradient(135deg,var(--chip),var(--chip2));
      }

      .dpt-preview {
        border-radius:12px;
        padding:10px 11px;
        margin-top:9px;
        background:linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
      }
      .dpt-preview-title { font-size:12px; font-weight:800; }
      .dpt-preview-sub { font-size:10px; color:var(--dpt-muted,#9ca3af); margin-top:2px; }
      .dpt-preview-bar {
        width:72%; height:4px; margin-top:9px; border-radius:999px;
        background:linear-gradient(90deg,var(--dpt-accent,#a855f7),var(--dpt-accent-2,#6d28d9));
      }

      .dpt-control-block { padding:8px 0; }
      .dpt-control-head {
        display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:6px;
      }
      .dpt-range { width:100%; accent-color:var(--dpt-accent,#a855f7); cursor:pointer; }
      .dpt-range-value {
        min-width:44px; text-align:right;
        font-size:11px; font-weight:800; color:var(--dpt-accent,#a855f7);
      }
      .dpt-select {
        max-width:145px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:8px;
        padding:6px 8px;
        font-size:11px;
      }

      .dpt-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
      .dpt-btn {
        border:1px solid var(--dpt-border,rgba(255,255,255,.11));
        border-radius:11px;
        background:linear-gradient(180deg,var(--dpt-surface-2,#2b2d31),var(--dpt-surface,#232428));
        color:var(--dpt-text,#fff);
        padding:9px 10px;
        font-size:12px;
        font-weight:750;
        cursor:pointer;
        box-shadow:0 3px 0 rgba(0,0,0,.18);
      }
      .dpt-btn:hover { border-color:var(--dpt-border-strong,#a855f7); }
      .dpt-btn.danger { background:#3a2023; color:#ffb4b9; }

      .dpt-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:7px; }
      .dpt-stat {
        background:var(--dpt-surface,#1c1d20);
        border:1px solid var(--dpt-border,rgba(255,255,255,.07));
        border-radius:11px;
        padding:9px 6px;
        text-align:center;
      }
      .dpt-stat b { display:block; font-size:12px; color:var(--dpt-text,#fff); }
      .dpt-stat span {
        display:block; font-size:10px; margin-top:2px; color:var(--dpt-muted,#8f969f);
      }



      /* v1.5.0 — Server Workspace+ */
      .dpt-serverws-panel {
        min-width:0;
      }

      .dpt-serverws-hero {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.45));
        border-radius:13px;
        padding:11px;
        background:
          radial-gradient(circle at 92% 8%,var(--dpt-accent-soft,rgba(168,85,247,.12)),transparent 38%),
          linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
      }
      .dpt-serverws-hero-copy {
        min-width:0;
      }
      .dpt-serverws-kicker {
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.8px;
        color:var(--dpt-accent,#a855f7);
      }
      .dpt-serverws-title {
        margin-top:3px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:13px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-serverws-sub {
        margin-top:4px;
        font-size:8.4px;
        line-height:1.4;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-serverws-pills {
        display:flex;
        flex-direction:column;
        align-items:flex-end;
        gap:5px;
        flex:0 0 auto;
      }
      .dpt-serverws-pill {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:5px 7px;
        background:rgba(255,255,255,.025);
        color:var(--dpt-muted,#9ca3af);
        font-size:7px;
        font-weight:900;
        letter-spacing:.4px;
      }
      .dpt-serverws-pill.active {
        border-color:var(--dpt-accent,#a855f7);
        color:var(--dpt-text,#fff);
        background:var(--dpt-accent-soft,rgba(168,85,247,.12));
      }
      .dpt-serverws-pill.auto {
        border-color:rgba(34,197,94,.32);
        color:#86efac;
        background:rgba(34,197,94,.07);
      }

      .dpt-serverws-metrics {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:6px;
        margin-top:8px;
      }
      .dpt-serverws-metrics > div {
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px 4px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-serverws-metrics b,
      .dpt-serverws-metrics span {
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .dpt-serverws-metrics b {
        font-size:9px;
        color:var(--dpt-text,#fff);
      }
      .dpt-serverws-metrics span {
        margin-top:2px;
        font-size:6.8px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-serverws-explainer {
        margin-top:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.07));
        border-radius:9px;
        padding:8px;
        background:rgba(255,255,255,.018);
        color:var(--dpt-muted,#9ca3af);
        font-size:8px;
        line-height:1.4;
      }

      .dpt-serverws-group-title {
        margin:11px 0 6px;
        padding-top:10px;
        border-top:1px solid var(--dpt-border,rgba(255,255,255,.07));
        color:var(--dpt-muted,#aeb5c2);
        font-size:8px;
        font-weight:900;
        letter-spacing:.65px;
        text-transform:uppercase;
      }

      .dpt-serverws-actions,
      .dpt-serverws-note-actions,
      .dpt-serverws-bottom-actions {
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
      .dpt-serverws-actions .dpt-btn,
      .dpt-serverws-note-actions .dpt-btn,
      .dpt-serverws-bottom-actions .dpt-btn {
        min-width:0;
        padding:7px;
        white-space:normal;
        line-height:1.2;
        font-size:8.6px;
      }

      .dpt-serverws-note {
        width:100%;
        box-sizing:border-box;
        min-height:72px;
        resize:vertical;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:9px;
        padding:8px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        outline:none;
        font:500 9px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;
      }
      .dpt-serverws-note:focus {
        border-color:var(--dpt-accent,#a855f7);
      }

      .dpt-serverws-quick-list,
      .dpt-serverws-library {
        display:grid;
        gap:6px;
        margin-top:7px;
      }

      .dpt-serverws-quick-item,
      .dpt-serverws-library-item {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:7px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-serverws-quick-item.start {
        border-color:rgba(34,197,94,.30);
      }
      .dpt-serverws-quick-copy,
      .dpt-serverws-library-copy {
        min-width:0;
        flex:1 1 auto;
      }
      .dpt-serverws-quick-name,
      .dpt-serverws-library-title {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:9px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-serverws-quick-sub,
      .dpt-serverws-library-sub,
      .dpt-serverws-library-note {
        margin-top:2px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:7.2px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-serverws-library-note {
        font-style:italic;
      }

      .dpt-serverws-empty {
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:11px;
        padding:10px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-serverws-empty-title {
        font-size:10px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-serverws-empty-sub {
        margin-top:4px;
        color:var(--dpt-muted,#9ca3af);
        font-size:8px;
        line-height:1.4;
      }

      @media (max-width:520px) {
        .dpt-serverws-metrics {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .dpt-serverws-hero {
          flex-direction:column;
        }
        .dpt-serverws-pills {
          flex-direction:row;
          align-items:center;
        }
      }

      .dpt-nav-current {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
      }
      .dpt-nav-current-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        margin-bottom:9px;
      }
      .dpt-nav-current-title {
        font-size:12px;
        font-weight:800;
        color:var(--dpt-text,#fff);
        overflow-wrap:anywhere;
      }
      .dpt-nav-current-sub {
        margin-top:2px;
        font-size:10px;
        color:var(--dpt-muted,#9ca3af);
        overflow-wrap:anywhere;
      }
      .dpt-nav-status {
        flex:0 0 auto;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:4px 6px;
        font-size:8px;
        font-weight:900;
        letter-spacing:.7px;
        color:var(--dpt-muted,#9ca3af);
        background:var(--dpt-bg,#111214);
      }
      .dpt-nav-status.active {
        color:var(--dpt-text,#fff);
        border-color:var(--dpt-accent,#a855f7);
        box-shadow:0 0 10px var(--dpt-accent-soft,rgba(168,85,247,.18));
      }
      .dpt-nav-quick { margin-top:3px; }
      .dpt-nav-quick .dpt-btn { font-size:10.5px; padding:7px 7px; }

      .dpt-nav-divider {
        height:1px;
        margin:11px 0;
        background:var(--dpt-border,rgba(255,255,255,.08));
      }
      .dpt-nav-group-title {
        margin:9px 0 6px;
        font-size:10px;
        font-weight:850;
        text-transform:uppercase;
        letter-spacing:.65px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-nav-group-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin-top:4px;
      }
      .dpt-nav-group-head .dpt-nav-group-title { margin-bottom:6px; }
      .dpt-nav-group-head .dpt-btn {
        padding:4px 7px;
        font-size:9px;
        border-radius:7px;
      }

      .dpt-nav-search {
        width:100%;
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:10px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        padding:8px 10px;
        font-size:11px;
        outline:none;
      }
      .dpt-nav-search:focus { border-color:var(--dpt-accent,#a855f7); }
      .dpt-nav-search::placeholder { color:var(--dpt-muted,#9ca3af); }

      .dpt-nav-note {
        width:100%;
        box-sizing:border-box;
        resize:vertical;
        min-height:64px;
        max-height:180px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:10px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        padding:8px 9px;
        font:inherit;
        font-size:11px;
        line-height:1.35;
        outline:none;
      }
      .dpt-nav-note:focus { border-color:var(--dpt-accent,#a855f7); }
      .dpt-nav-note:disabled { opacity:.5; cursor:not-allowed; }
      .dpt-nav-note-actions { margin-top:7px; }
      .dpt-nav-note-actions .dpt-btn { padding:7px 8px; font-size:10.5px; }

      .dpt-nav-list {
        display:grid;
        gap:6px;
      }
      .dpt-nav-item {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:7px 7px 7px 9px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-nav-item[hidden] { display:none !important; }
      .dpt-nav-copy { min-width:0; flex:1 1 auto; }
      .dpt-nav-name {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:11px;
        font-weight:800;
        color:var(--dpt-text,#fff);
      }
      .dpt-nav-sub {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-top:2px;
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-nav-actions {
        flex:0 0 auto;
        display:flex;
        gap:4px;
      }
      .dpt-nav-mini {
        padding:5px 6px !important;
        border-radius:7px !important;
        font-size:9px !important;
      }
      .dpt-nav-empty {
        border:1px dashed var(--dpt-border,rgba(255,255,255,.10));
        border-radius:9px;
        padding:8px;
        font-size:10px;
        text-align:center;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-nav-workspace-actions { margin-top:10px; }
      .dpt-nav-workspace-actions .dpt-btn { font-size:10px; padding:7px; }
      .dpt-btn:disabled {
        opacity:.45;
        cursor:not-allowed;
        transform:none !important;
      }


      html[data-dpt-message-pick="1"] body {
        cursor: crosshair !important;
      }
      .dpt-message-pick-hover {
        outline:2px dashed var(--dpt-accent,#a855f7) !important;
        outline-offset:2px !important;
        border-radius:6px !important;
      }
      .dpt-picked-message {
        outline:2px solid var(--dpt-accent,#a855f7) !important;
        outline-offset:2px !important;
        border-radius:6px !important;
      }

      .dpt-message-picker-status {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:11px;
        padding:9px 10px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-message-picker-status.picking {
        border-color:var(--dpt-accent,#a855f7);
        box-shadow:0 0 14px var(--dpt-accent-soft,rgba(168,85,247,.18));
      }
      .dpt-message-picker-title {
        font-size:11px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-message-picker-sub {
        margin-top:3px;
        font-size:10px;
        line-height:1.35;
        color:var(--dpt-muted,#9ca3af);
        overflow-wrap:anywhere;
      }

      .dpt-message-actions {
        margin-top:8px;
      }
      .dpt-message-actions .dpt-btn {
        padding:7px 7px;
        font-size:10px;
      }

      .dpt-message-metrics {
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:6px;
        margin-top:8px;
      }
      .dpt-message-metric {
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:7px 4px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-message-metric b {
        display:block;
        font-size:11px;
        color:var(--dpt-text,#fff);
      }
      .dpt-message-metric span {
        display:block;
        margin-top:2px;
        font-size:8px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-message-preview {
        margin-top:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:11px;
        padding:9px 10px;
        background:linear-gradient(
          135deg,
          var(--dpt-surface,#1c1d20),
          var(--dpt-surface-2,#25262b)
        );
      }
      .dpt-message-preview-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
      }
      .dpt-message-preview-head strong {
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:11px;
        color:var(--dpt-text,#fff);
      }
      .dpt-message-preview-head span {
        flex:0 0 auto;
        max-width:48%;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:8px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message-preview-location {
        margin-top:3px;
        font-size:9px;
        color:var(--dpt-accent,#a855f7);
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .dpt-message-preview-text {
        margin-top:7px;
        max-height:110px;
        overflow:auto;
        white-space:pre-wrap;
        overflow-wrap:anywhere;
        font-size:10px;
        line-height:1.4;
        color:var(--dpt-text,#fff);
      }

      .dpt-message-saved-list {
        display:grid;
        gap:6px;
        margin-top:7px;
      }
      .dpt-message-saved-item {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:7px 7px 7px 9px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-message-saved-item[hidden] {
        display:none !important;
      }
      .dpt-message-saved-copy {
        min-width:0;
        flex:1 1 auto;
      }
      .dpt-message-saved-author {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:10.5px;
        font-weight:800;
        color:var(--dpt-text,#fff);
      }
      .dpt-message-saved-excerpt {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-top:2px;
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message-saved-meta {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-top:2px;
        font-size:8px;
        color:var(--dpt-muted,#7f8791);
      }
      .dpt-message-library-actions {
        margin-top:9px;
      }
      .dpt-message-library-actions .dpt-btn {
        padding:7px;
        font-size:10px;
      }

      /* v1.3.0 — Message Utilities 2.0 */
      .dpt-message2-hero {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.45));
        border-radius:13px;
        padding:11px;
        background:
          radial-gradient(circle at 92% 8%,var(--dpt-accent-soft,rgba(168,85,247,.12)),transparent 38%),
          linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
      }
      .dpt-message2-hero.picking {
        border-color:var(--dpt-accent,#a855f7);
        box-shadow:0 0 14px var(--dpt-accent-soft,rgba(168,85,247,.15));
      }
      .dpt-message2-hero-copy { min-width:0; }
      .dpt-message2-kicker {
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.8px;
        color:var(--dpt-accent,#a855f7);
      }
      .dpt-message2-title {
        margin-top:3px;
        font-size:13px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-message2-sub {
        margin-top:4px;
        font-size:8.6px;
        line-height:1.4;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message2-state {
        flex:0 0 auto;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:5px 7px;
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.4px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message2-state.active {
        color:var(--dpt-text,#fff);
        border-color:var(--dpt-accent,#a855f7);
        background:var(--dpt-accent-soft,rgba(168,85,247,.12));
      }

      .dpt-message2-primary-actions {
        margin-top:8px;
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
      .dpt-message2-primary-actions .dpt-btn,
      .dpt-message2-tool-grid .dpt-btn {
        min-width:0;
        white-space:normal;
        line-height:1.2;
      }

      .dpt-message2-metrics {
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:6px;
        margin-top:8px;
      }
      .dpt-message2-metric {
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px 4px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-message2-metric b {
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:10px;
        color:var(--dpt-text,#fff);
      }
      .dpt-message2-metric span {
        display:block;
        margin-top:2px;
        font-size:7px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-message2-preview {
        margin-top:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:11px;
        padding:9px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-message2-preview-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
      }
      .dpt-message2-preview-head strong {
        font-size:10.5px;
        color:var(--dpt-text,#fff);
      }
      .dpt-message2-preview-head > span {
        flex:0 0 auto;
        font-size:7.8px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message2-preview-location {
        margin-top:2px;
        font-size:7.8px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message2-preview-text {
        max-height:135px;
        overflow:auto;
        margin-top:8px;
        white-space:pre-wrap;
        overflow-wrap:anywhere;
        font-size:9.5px;
        line-height:1.45;
        color:var(--dpt-text,#fff);
      }
      .dpt-message2-id-row {
        display:flex;
        flex-wrap:wrap;
        gap:6px 12px;
        margin-top:8px;
        padding-top:7px;
        border-top:1px solid var(--dpt-border,rgba(255,255,255,.06));
        font:700 7.5px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-message2-section-label {
        margin:12px 0 7px;
        padding-top:10px;
        border-top:1px solid var(--dpt-border,rgba(255,255,255,.07));
        font-size:8px;
        font-weight:900;
        letter-spacing:.65px;
        text-transform:uppercase;
        color:var(--dpt-muted,#aeb5c2);
      }
      .dpt-message2-tool-grid {
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
      .dpt-message2-tool-grid .dpt-btn {
        padding:7px;
        font-size:8.8px;
      }

      .dpt-message2-link-list {
        display:grid;
        gap:6px;
      }
      .dpt-message2-link-item {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:7px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-message2-link-copy {
        min-width:0;
        flex:1 1 auto;
      }
      .dpt-message2-link-host {
        font-size:8.5px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-message2-link-url {
        margin-top:2px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:7.5px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-message2-compare-slots {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:7px;
      }
      .dpt-message2-compare-slot {
        display:flex;
        align-items:flex-start;
        gap:7px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:8px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-message2-compare-slot.filled {
        border-color:var(--dpt-border-strong,rgba(168,85,247,.42));
      }
      .dpt-message2-compare-slot > span {
        display:grid;
        place-items:center;
        flex:0 0 auto;
        width:22px;
        height:22px;
        border-radius:7px;
        background:var(--dpt-accent-soft,rgba(168,85,247,.12));
        color:var(--dpt-accent,#a855f7);
        font-size:9px;
        font-weight:900;
      }
      .dpt-message2-compare-slot > div {
        min-width:0;
      }
      .dpt-message2-compare-slot strong,
      .dpt-message2-compare-slot small {
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .dpt-message2-compare-slot strong {
        font-size:8.7px;
        color:var(--dpt-text,#fff);
      }
      .dpt-message2-compare-slot small {
        margin-top:2px;
        font-size:7.3px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message2-compare-summary {
        display:grid;
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:6px;
        margin-top:7px;
      }
      .dpt-message2-compare-summary > div {
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:8px;
        padding:7px 4px;
        text-align:center;
        background:rgba(255,255,255,.018);
      }
      .dpt-message2-compare-summary b,
      .dpt-message2-compare-summary span {
        display:block;
      }
      .dpt-message2-compare-summary b {
        font-size:9px;
        color:var(--dpt-text,#fff);
      }
      .dpt-message2-compare-summary span {
        margin-top:2px;
        font-size:6.8px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-message2-library-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:8px;
      }
      .dpt-message2-library-sub {
        margin-top:2px;
        font-size:7.5px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-message2-library-controls {
        display:grid;
        grid-template-columns:minmax(0,1.5fr) minmax(0,.75fr) minmax(0,.75fr);
        gap:6px;
        margin:7px 0;
      }
      .dpt-message2-library-select {
        min-width:0;
        width:100%;
        font-size:8px;
      }

      .dpt-message-saved-item.favorite {
        border-color:rgba(245,158,11,.34);
      }
      .dpt-message-saved-title-row {
        display:flex;
        align-items:center;
        gap:5px;
        min-width:0;
      }
      .dpt-message-favorite-pill {
        flex:0 0 auto;
        border:1px solid rgba(245,158,11,.30);
        border-radius:999px;
        padding:2px 4px;
        background:rgba(245,158,11,.07);
        color:#fcd34d;
        font-size:6.5px;
        font-weight:900;
      }
      .dpt-message-favorite {
        min-width:26px !important;
        font-size:12px !important;
        color:#fcd34d !important;
      }

      @media (max-width:520px) {
        .dpt-message2-metrics {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .dpt-message2-library-controls {
          grid-template-columns:1fr;
        }
        .dpt-message2-compare-slots {
          grid-template-columns:1fr;
        }
      }




      /* v1.4.0 — Media Center 2.0 */
      .dpt-media2-hero {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.45));
        border-radius:13px;
        padding:11px;
        background:
          radial-gradient(circle at 92% 8%,var(--dpt-accent-soft,rgba(168,85,247,.12)),transparent 38%),
          linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
      }
      .dpt-media2-hero-copy { min-width:0; }
      .dpt-media2-kicker {
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.8px;
        color:var(--dpt-accent,#a855f7);
      }
      .dpt-media2-title {
        margin-top:3px;
        font-size:13px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-media2-sub {
        margin-top:4px;
        font-size:8.6px;
        line-height:1.4;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-media2-hero-pills {
        display:flex;
        flex-direction:column;
        align-items:flex-end;
        gap:5px;
        flex:0 0 auto;
      }
      .dpt-media2-count-pill {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:5px 7px;
        background:rgba(255,255,255,.025);
        color:var(--dpt-muted,#9ca3af);
        font-size:7px;
        font-weight:900;
        letter-spacing:.4px;
      }
      .dpt-media2-count-pill.favorite {
        border-color:rgba(245,158,11,.30);
        color:#fcd34d;
        background:rgba(245,158,11,.06);
      }

      .dpt-media2-metrics {
        display:grid;
        grid-template-columns:repeat(4,minmax(0,1fr));
        gap:6px;
        margin-top:8px;
      }
      .dpt-media2-metrics > div {
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px 4px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-media2-metrics b,
      .dpt-media2-metrics span {
        display:block;
      }
      .dpt-media2-metrics b {
        font-size:10px;
        color:var(--dpt-text,#fff);
      }
      .dpt-media2-metrics span {
        margin-top:2px;
        font-size:7px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-media2-inspector {
        margin-top:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:12px;
        padding:9px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-media2-inspector.empty {
        padding:10px;
      }
      .dpt-media2-inspector-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
      }
      .dpt-media2-inspector-kicker {
        font-size:7px;
        font-weight:900;
        letter-spacing:.65px;
        color:var(--dpt-accent,#a855f7);
      }
      .dpt-media2-inspector-title {
        margin-top:2px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:10.5px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-media2-inspector-empty {
        margin-top:4px;
        font-size:8.4px;
        line-height:1.4;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-media2-type-pill {
        flex:0 0 auto;
        border-radius:999px;
        padding:4px 6px;
        font-size:6.8px;
        font-weight:900;
        letter-spacing:.4px;
      }
      .dpt-media2-type-pill.image {
        border:1px solid rgba(59,130,246,.30);
        color:#93c5fd;
        background:rgba(59,130,246,.06);
      }
      .dpt-media2-type-pill.video {
        border:1px solid rgba(168,85,247,.30);
        color:#d8b4fe;
        background:rgba(168,85,247,.06);
      }
      .dpt-media2-type-pill.audio {
        border:1px solid rgba(34,197,94,.30);
        color:#86efac;
        background:rgba(34,197,94,.06);
      }
      .dpt-media2-type-pill.file {
        border:1px solid rgba(148,163,184,.28);
        color:#cbd5e1;
        background:rgba(148,163,184,.05);
      }

      .dpt-media2-inspector-grid {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:5px;
        margin-top:8px;
      }
      .dpt-media2-inspector-row {
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.06));
        border-radius:8px;
        padding:6px;
        background:rgba(255,255,255,.018);
      }
      .dpt-media2-inspector-row span,
      .dpt-media2-inspector-row strong {
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .dpt-media2-inspector-row span {
        font-size:6.8px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-media2-inspector-row strong {
        margin-top:2px;
        font-size:8.2px;
        color:var(--dpt-text,#fff);
      }
      .dpt-media2-inspector-actions {
        margin-top:8px;
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
      .dpt-media2-inspector-actions .dpt-btn {
        min-width:0;
        padding:7px;
        font-size:8.5px;
      }

      .dpt-media2-section-label {
        margin:12px 0 7px;
        padding-top:10px;
        border-top:1px solid var(--dpt-border,rgba(255,255,255,.07));
        font-size:8px;
        font-weight:900;
        letter-spacing:.65px;
        text-transform:uppercase;
        color:var(--dpt-muted,#aeb5c2);
      }

      .dpt-media2-filters {
        display:flex;
        flex-wrap:wrap;
        gap:5px;
        margin-bottom:7px;
      }
      .dpt-media2-filter {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:5px 7px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-muted,#9ca3af);
        font:800 7.5px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        cursor:pointer;
      }
      .dpt-media2-filter.active {
        border-color:var(--dpt-accent,#a855f7);
        background:var(--dpt-accent-soft,rgba(168,85,247,.12));
        color:var(--dpt-text,#fff);
      }

      .dpt-media2-library-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:8px;
      }
      .dpt-media2-library-sub {
        margin-top:2px;
        font-size:7.5px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-media2-library-controls {
        display:grid;
        grid-template-columns:minmax(0,1.5fr) minmax(0,.75fr) minmax(0,.75fr);
        gap:6px;
        margin:7px 0;
      }
      .dpt-media2-select {
        width:100%;
        min-width:0;
        font-size:8px;
      }

      .dpt-media-saved-item.favorite {
        border-color:rgba(245,158,11,.34);
      }
      .dpt-media2-saved-title-row {
        display:flex;
        align-items:center;
        gap:5px;
        min-width:0;
      }
      .dpt-media2-favorite-pill {
        flex:0 0 auto;
        border:1px solid rgba(245,158,11,.30);
        border-radius:999px;
        padding:2px 4px;
        background:rgba(245,158,11,.07);
        color:#fcd34d;
        font-size:6.5px;
        font-weight:900;
      }
      .dpt-media2-favorite {
        min-width:26px !important;
        color:#fcd34d !important;
        font-size:12px !important;
      }

      @media (max-width:520px) {
        .dpt-media2-metrics {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .dpt-media2-inspector-grid {
          grid-template-columns:1fr;
        }
        .dpt-media2-library-controls {
          grid-template-columns:1fr;
        }
      }

      .dpt-media-status {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:11px;
        padding:9px 10px;
        background:linear-gradient(
          135deg,
          var(--dpt-surface,#1c1d20),
          var(--dpt-surface-2,#25262b)
        );
      }
      .dpt-media-status-title {
        font-size:11px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-media-status-sub {
        margin-top:3px;
        font-size:9px;
        line-height:1.35;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-media-actions {
        margin-top:8px;
      }
      .dpt-media-actions .dpt-btn {
        padding:7px 7px;
        font-size:9.5px;
      }

      .dpt-media-list,
      .dpt-media-saved-list {
        display:grid;
        gap:6px;
      }

      .dpt-media-item,
      .dpt-media-saved-item {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:7px 7px 7px 9px;
        background:var(--dpt-surface,#1c1d20);
      }

      .dpt-media-saved-item[hidden] {
        display:none !important;
      }

      .dpt-media-item-copy,
      .dpt-media-saved-copy {
        min-width:0;
        flex:1 1 auto;
      }

      .dpt-media-item-name,
      .dpt-media-saved-name {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:10.5px;
        font-weight:800;
        color:var(--dpt-text,#fff);
      }

      .dpt-media-item-meta,
      .dpt-media-saved-meta {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        margin-top:2px;
        font-size:8.5px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-media-backup-actions {
        margin-top:9px;
      }
      .dpt-media-backup-actions .dpt-btn {
        padding:7px;
        font-size:10px;
      }


      #dpt-focus-badge {
        position:fixed;
        right:14px;
        bottom:14px;
        z-index:2147483645;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.70));
        border-radius:999px;
        padding:8px 11px;
        background:var(--dpt-bg,#111214);
        color:var(--dpt-text,#fff);
        box-shadow:0 8px 22px rgba(0,0,0,.35),0 0 14px var(--dpt-accent-soft,rgba(168,85,247,.18));
        font:800 10px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.4px;
        cursor:pointer;
      }
      #dpt-focus-badge[hidden] { display:none !important; }
      #dpt-focus-badge[data-mode="break"] {
        border-color:#22c55e;
      }

      .dpt-focus-status {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
      }
      .dpt-focus-status-head {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin-bottom:8px;
      }
      .dpt-focus-status-title {
        font-size:11px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-focus-status-sub {
        margin-top:2px;
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-focus-pill {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:4px 7px;
        font-size:8px;
        font-weight:900;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-focus-pill.active {
        color:var(--dpt-text,#fff);
        border-color:var(--dpt-accent,#a855f7);
        box-shadow:0 0 10px var(--dpt-accent-soft,rgba(168,85,247,.18));
      }

      .dpt-focus-presets .dpt-btn,
      .dpt-focus-timer-actions .dpt-btn {
        padding:7px;
        font-size:10px;
      }

      .dpt-focus-timer {
        margin-top:4px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.60));
        border-radius:14px;
        padding:14px 10px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        font-size:28px;
        font-weight:900;
        letter-spacing:1px;
        font-variant-numeric:tabular-nums;
      }
      .dpt-focus-timer-meta {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        margin:6px 1px 8px;
        font-size:8.5px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-focus-number-wrap {
        display:flex;
        align-items:center;
        gap:5px;
        font-size:10px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-focus-number {
        width:58px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:8px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        padding:5px 6px;
        font-size:10px;
        text-align:right;
      }

      /* Focus-mode Discord UI controls use semantic labels and broad layout
         fallbacks only; no hashed class names are required. */
      html[data-dpt-focus="1"][data-dpt-hide-servers="1"] nav[aria-label="Servers"],
      html[data-dpt-focus="1"][data-dpt-hide-servers="1"] [aria-label="Servers"][role="tree"] {
        display:none !important;
      }

      html[data-dpt-focus="1"][data-dpt-hide-channels="1"] nav[aria-label*="Channels"],
      html[data-dpt-focus="1"][data-dpt-hide-channels="1"] [aria-label*="Channels"][role="navigation"] {
        display:none !important;
      }

      html[data-dpt-focus="1"][data-dpt-hide-members="1"] [aria-label*="Members"][role="list"],
      html[data-dpt-focus="1"][data-dpt-hide-members="1"] [aria-label*="Member List"],
      html[data-dpt-focus="1"][data-dpt-hide-members="1"] aside[aria-label*="Members"] {
        display:none !important;
      }

      html[data-dpt-focus="1"][data-dpt-hide-activity="1"] [aria-label*="Activity" i],
      html[data-dpt-focus="1"][data-dpt-hide-activity="1"] [aria-label*="Now Playing" i],
      html[data-dpt-focus="1"][data-dpt-hide-activity="1"] [aria-label*="Active Now" i],
      html[data-dpt-focus="1"][data-dpt-hide-activity="1"] [data-dpt-focus-activity-panel="1"] {
        display:none !important;
      }

      html[data-dpt-focus="1"][data-dpt-quiet-badges="1"] [class*="badge"],
      html[data-dpt-focus="1"][data-dpt-quiet-badges="1"] [aria-label*="unread" i],
      html[data-dpt-focus="1"][data-dpt-quiet-badges="1"] [aria-label*="mention" i] {
        opacity:.18 !important;
      }

      html[data-dpt-focus="1"][data-dpt-dim-media="1"] [id^="message-content-"] ~ * img,
      html[data-dpt-focus="1"][data-dpt-dim-media="1"] [id^="message-content-"] ~ * video,
      html[data-dpt-focus="1"][data-dpt-dim-media="1"] [data-list-item-id^="chat-messages___"] img,
      html[data-dpt-focus="1"][data-dpt-dim-media="1"] [data-list-item-id^="chat-messages___"] video {
        opacity:.32 !important;
        transition:opacity .12s ease !important;
      }
      html[data-dpt-focus="1"][data-dpt-dim-media="1"] [data-list-item-id^="chat-messages___"] img:hover,
      html[data-dpt-focus="1"][data-dpt-dim-media="1"] [data-list-item-id^="chat-messages___"] video:hover {
        opacity:1 !important;
      }

      html[data-dpt-focus="1"][data-dpt-compact-messages="1"] [data-list-item-id^="chat-messages___"] {
        margin-top:-3px !important;
        margin-bottom:-3px !important;
      }


      .dpt-nitro-status {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
      }
      .dpt-nitro-status-title {
        font-size:11px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-nitro-status-sub {
        margin-top:3px;
        font-size:9px;
        line-height:1.35;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-nitro-card {
        --preview-a1:#A855F7;
        --preview-a2:#5865F2;
        --preview-speed:8s;
        position:relative;
        overflow:hidden;
        margin-top:6px;
        border:1px solid color-mix(in srgb,var(--preview-a1) 45%,transparent);
        border-radius:15px;
        background:#111214;
        color:#fff;
      }
      .dpt-nitro-card.glow {
        box-shadow:
          0 14px 30px rgba(0,0,0,.30),
          0 0 20px color-mix(in srgb,var(--preview-a1) 28%,transparent);
      }
      .dpt-nitro-card.effect-aurora:before,
      .dpt-nitro-card.effect-pulse:before,
      .dpt-nitro-card.effect-shimmer:before {
        content:"";
        position:absolute;
        inset:-40%;
        pointer-events:none;
        z-index:0;
      }
      .dpt-nitro-card.effect-aurora:before {
        background:
          radial-gradient(circle at 20% 30%,color-mix(in srgb,var(--preview-a1) 35%,transparent),transparent 36%),
          radial-gradient(circle at 80% 70%,color-mix(in srgb,var(--preview-a2) 35%,transparent),transparent 40%);
        animation:dptNitroAurora var(--preview-speed) linear infinite;
      }
      .dpt-nitro-card.effect-pulse:before {
        background:radial-gradient(circle,color-mix(in srgb,var(--preview-a1) 28%,transparent),transparent 55%);
        animation:dptNitroPulse var(--preview-speed) ease-in-out infinite;
      }
      .dpt-nitro-card.effect-shimmer:before {
        background:linear-gradient(
          115deg,
          transparent 35%,
          color-mix(in srgb,#fff 16%,transparent) 48%,
          color-mix(in srgb,var(--preview-a1) 20%,transparent) 52%,
          transparent 65%
        );
        animation:dptNitroShimmer var(--preview-speed) linear infinite;
      }

      @keyframes dptNitroAurora {
        0% { transform:translate3d(-6%,-4%,0) rotate(0deg); }
        50% { transform:translate3d(6%,4%,0) rotate(180deg); }
        100% { transform:translate3d(-6%,-4%,0) rotate(360deg); }
      }
      @keyframes dptNitroPulse {
        0%,100% { transform:scale(.88); opacity:.45; }
        50% { transform:scale(1.12); opacity:.95; }
      }
      @keyframes dptNitroShimmer {
        from { transform:translateX(-45%); }
        to { transform:translateX(45%); }
      }

      .dpt-nitro-banner {
        position:relative;
        z-index:1;
        height:88px;
        background:
          linear-gradient(135deg,var(--preview-a1),var(--preview-a2));
        background-size:cover;
        background-position:center;
      }
      .dpt-nitro-avatar-wrap {
        position:relative;
        z-index:2;
        width:70px;
        height:70px;
        margin:-35px 0 0 13px;
        border-radius:50%;
        padding:3px;
        background:#111214;
      }
      .dpt-nitro-avatar-wrap.ring {
        background:linear-gradient(
          135deg,
          var(--preview-a1),
          var(--preview-a2),
          var(--preview-a1)
        );
        background-size:200% 200%;
        animation:dptNitroRing var(--preview-speed) linear infinite;
      }
      @keyframes dptNitroRing {
        0% { background-position:0% 50%; }
        100% { background-position:200% 50%; }
      }
      .dpt-nitro-avatar {
        width:100%;
        height:100%;
        display:block;
        object-fit:cover;
        border-radius:50%;
        border:3px solid #111214;
        box-sizing:border-box;
      }
      .dpt-nitro-body {
        position:relative;
        z-index:1;
        padding:8px 13px 13px;
      }
      .dpt-nitro-badges {
        display:flex;
        align-items:center;
        gap:5px;
        flex-wrap:wrap;
      }
      .dpt-local-only-pill,
      .dpt-nitro-badge {
        display:inline-flex;
        align-items:center;
        gap:3px;
        border-radius:999px;
        padding:4px 6px;
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.55px;
      }
      .dpt-local-only-pill {
        background:#202225;
        border:1px solid rgba(255,255,255,.12);
        color:#b5bac1;
      }
      .dpt-nitro-badge {
        background:linear-gradient(135deg,var(--preview-a1),var(--preview-a2));
        color:#fff;
        border:1px solid rgba(255,255,255,.16);
      }
      .dpt-nitro-name {
        margin-top:7px;
        font-size:15px;
        font-weight:900;
      }
      .dpt-nitro-bio {
        margin-top:4px;
        white-space:pre-wrap;
        overflow-wrap:anywhere;
        font-size:9.5px;
        line-height:1.4;
        color:#b5bac1;
      }
      .dpt-nitro-demo-row {
        display:flex;
        flex-wrap:wrap;
        gap:5px;
        margin-top:9px;
      }
      .dpt-nitro-demo-chip {
        border:1px solid color-mix(in srgb,var(--preview-a1) 30%,rgba(255,255,255,.10));
        border-radius:7px;
        padding:4px 6px;
        background:rgba(255,255,255,.04);
        font-size:8px;
        color:#dbdee1;
      }

      .dpt-nitro-image-actions,
      .dpt-nitro-backup-actions {
        margin-top:8px;
      }
      .dpt-nitro-image-actions .dpt-btn,
      .dpt-nitro-backup-actions .dpt-btn {
        padding:7px;
        font-size:9.5px;
      }
      .dpt-nitro-input,
      .dpt-nitro-textarea {
        width:100%;
        box-sizing:border-box;
        margin-top:6px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:9px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        padding:7px 8px;
        font:inherit;
        font-size:10px;
        outline:none;
      }
      .dpt-nitro-textarea {
        resize:vertical;
        min-height:62px;
        max-height:140px;
      }
      .dpt-nitro-input:focus,
      .dpt-nitro-textarea:focus {
        border-color:var(--dpt-accent,#a855f7);
      }
      .dpt-nitro-color-wrap {
        display:flex;
        align-items:center;
        gap:7px;
      }
      .dpt-nitro-color {
        width:31px;
        height:25px;
        padding:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:7px;
        background:transparent;
        cursor:pointer;
      }
      .dpt-nitro-color-value {
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
        font-family:ui-monospace,SFMono-Regular,Consolas,monospace;
      }

      /* Local-only Nitro-style hover enhancements. These do not unlock
         cross-server emoji/sticker entitlements or change sent messages. */
      html[data-dpt-nitro-preview="1"][data-dpt-nitro-emoji-hover="1"]
      [data-list-item-id^="chat-messages___"] img[alt^=":"]:hover {
        transform:scale(1.65) !important;
        z-index:50 !important;
        position:relative !important;
        filter:drop-shadow(0 5px 12px rgba(0,0,0,.35));
      }

      html[data-dpt-nitro-preview="1"][data-dpt-nitro-sticker-hover="1"]
      [data-list-item-id^="chat-messages___"] img[src*="/stickers/"]:hover,
      html[data-dpt-nitro-preview="1"][data-dpt-nitro-sticker-hover="1"]
      [data-list-item-id^="chat-messages___"] img[src*="sticker"]:hover {
        transform:scale(1.16) !important;
        z-index:50 !important;
        position:relative !important;
      }

      html[data-dpt-nitro-preview="1"][data-dpt-nitro-reaction-hover="1"]
      [aria-label*="reaction" i]:hover {
        transform:scale(1.08) !important;
      }


      #dpt-notification-badge {
        position:fixed;
        right:14px;
        bottom:50px;
        z-index:2147483645;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.70));
        border-radius:999px;
        padding:7px 10px;
        background:var(--dpt-bg,#111214);
        color:var(--dpt-text,#fff);
        box-shadow:0 8px 22px rgba(0,0,0,.35);
        font:800 9px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.35px;
        cursor:pointer;
      }
      #dpt-notification-badge[hidden] {
        display:none !important;
      }
      #dpt-notification-badge[data-quiet="1"] {
        border-color:#64748b;
        color:#cbd5e1;
      }

      .dpt-notification-status {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(
          135deg,
          var(--dpt-surface,#1c1d20),
          var(--dpt-surface-2,#25262b)
        );
      }
      .dpt-notification-status-title {
        font-size:11px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-notification-status-sub {
        margin-top:3px;
        font-size:9px;
        line-height:1.35;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-notification-snooze .dpt-btn,
      .dpt-notification-tools .dpt-btn {
        padding:7px;
        font-size:9.5px;
      }

      .dpt-notification-time {
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:8px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        padding:5px 6px;
        font-size:10px;
      }

      .dpt-notification-metrics {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:6px;
        margin-bottom:8px;
      }
      .dpt-notification-metric {
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px 4px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-notification-metric b {
        display:block;
        font-size:10.5px;
        color:var(--dpt-text,#fff);
      }
      .dpt-notification-metric span {
        display:block;
        margin-top:2px;
        font-size:8px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-notification-list {
        display:grid;
        gap:6px;
      }
      .dpt-notification-item {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:7px 7px 7px 9px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-notification-item-copy {
        min-width:0;
        flex:1 1 auto;
      }
      .dpt-notification-item-kind {
        font-size:8px;
        font-weight:900;
        color:var(--dpt-accent,#a855f7);
        text-transform:uppercase;
        letter-spacing:.5px;
      }
      .dpt-notification-item-label {
        margin-top:2px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:9px;
        color:var(--dpt-text,#fff);
      }

      /* Local-only visual notification controls.
         These do not mark messages read or alter Discord notification settings. */
      html[data-dpt-notification-control="1"][data-dpt-hide-mentions="1"]
      [class*="badge"],
      html[data-dpt-notification-control="1"][data-dpt-hide-mentions="1"]
      [aria-label*="mention" i] {
        display:none !important;
      }

      html[data-dpt-notification-control="1"][data-dpt-hide-unread="1"]
      [aria-label*="unread" i] {
        opacity:0 !important;
        pointer-events:none !important;
      }

      html[data-dpt-notification-control="1"][data-dpt-soften-badges="1"]
      [class*="badge"] {
        opacity:.32 !important;
      }

      html[data-dpt-notification-control="1"][data-dpt-notification-quiet="1"]
      [aria-label*="notification" i],
      html[data-dpt-notification-control="1"][data-dpt-notification-quiet="1"]
      [aria-label*="mention" i],
      html[data-dpt-notification-control="1"][data-dpt-notification-quiet="1"]
      [aria-label*="unread" i] {
        opacity:.10 !important;
      }


      #dpt-privacy-badge {
        position:fixed;
        right:14px;
        bottom:86px;
        z-index:2147483645;
        border:1px solid #22c55e;
        border-radius:999px;
        padding:7px 10px;
        background:var(--dpt-bg,#111214);
        color:#dcfce7;
        box-shadow:0 8px 22px rgba(0,0,0,.35);
        font:800 9px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.35px;
        cursor:pointer;
      }
      #dpt-privacy-badge[hidden] {
        display:none !important;
      }

      .dpt-privacy-status {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(
          135deg,
          var(--dpt-surface,#1c1d20),
          var(--dpt-surface-2,#25262b)
        );
      }
      .dpt-privacy-status-title {
        font-size:11px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-privacy-status-sub {
        margin-top:3px;
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-privacy-tools .dpt-btn {
        padding:7px;
        font-size:9.5px;
      }

      .dpt-privacy-warning {
        margin-top:7px;
        border:1px solid rgba(245,158,11,.24);
        border-radius:9px;
        padding:8px;
        background:rgba(245,158,11,.07);
        color:#fcd34d;
        font-size:9px;
        line-height:1.35;
      }

      .dpt-privacy-metrics {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:6px;
        margin-bottom:8px;
      }
      .dpt-privacy-metric {
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px 4px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-privacy-metric b {
        display:block;
        font-size:11px;
        color:var(--dpt-text,#fff);
      }
      .dpt-privacy-metric span {
        display:block;
        margin-top:2px;
        font-size:8px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-privacy-audit-list {
        display:grid;
        gap:6px;
      }
      .dpt-privacy-audit-item {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:7px 7px 7px 9px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-privacy-audit-copy {
        min-width:0;
        flex:1 1 auto;
      }
      .dpt-privacy-audit-title {
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:10px;
        font-weight:800;
        color:var(--dpt-text,#fff);
      }
      .dpt-privacy-audit-url {
        margin-top:2px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:8px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-privacy-clean-pill {
        display:inline-block;
        margin-top:4px;
        border:1px solid rgba(34,197,94,.32);
        border-radius:999px;
        padding:3px 5px;
        background:rgba(34,197,94,.08);
        color:#86efac;
        font-size:7px;
        font-weight:900;
        letter-spacing:.45px;
      }

      html[data-dpt-privacy="1"][data-dpt-private-hover="1"]
      a[href^="http"]:hover {
        text-decoration:none !important;
        filter:saturate(.8);
      }


      #dpt-performance2-badge {
        position:fixed;
        left:14px;
        bottom:14px;
        z-index:2147483645;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.70));
        border-radius:999px;
        padding:7px 10px;
        background:var(--dpt-bg,#111214);
        color:var(--dpt-text,#fff);
        box-shadow:0 8px 22px rgba(0,0,0,.35);
        font:800 9px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        letter-spacing:.35px;
        cursor:pointer;
      }
      #dpt-performance2-badge[hidden] {
        display:none !important;
      }


      /* v1.2.2 — Performance+ 2.0 presentation polish */
      .dpt-perf2-hero {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:12px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.46));
        border-radius:14px;
        padding:12px;
        background:
          radial-gradient(circle at 90% 5%,var(--dpt-accent-soft,rgba(168,85,247,.13)),transparent 38%),
          linear-gradient(135deg,var(--dpt-surface,#1c1d20),var(--dpt-surface-2,#25262b));
        box-shadow:0 10px 24px rgba(0,0,0,.18);
      }
      .dpt-perf2-hero-copy { min-width:0; }
      .dpt-perf2-hero-kicker {
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.85px;
        color:var(--dpt-accent,#a855f7);
      }
      .dpt-perf2-hero-title {
        margin-top:4px;
        font-size:13px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-perf2-hero-sub {
        margin-top:4px;
        max-width:360px;
        font-size:8.8px;
        line-height:1.4;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-perf2-hero-pills {
        display:flex;
        flex-direction:column;
        align-items:flex-end;
        gap:5px;
        flex:0 0 auto;
      }
      .dpt-perf2-state-pill,
      .dpt-perf2-load-pill {
        border-radius:999px;
        padding:5px 7px;
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.4px;
        white-space:nowrap;
      }
      .dpt-perf2-state-pill {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        background:rgba(255,255,255,.035);
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-perf2-state-pill.active {
        border-color:var(--dpt-accent,#a855f7);
        background:var(--dpt-accent-soft,rgba(168,85,247,.12));
        color:var(--dpt-text,#fff);
      }
      .dpt-perf2-load-pill.low {
        border:1px solid rgba(34,197,94,.32);
        background:rgba(34,197,94,.08);
        color:#86efac;
      }
      .dpt-perf2-load-pill.moderate {
        border:1px solid rgba(245,158,11,.32);
        background:rgba(245,158,11,.08);
        color:#fcd34d;
      }
      .dpt-perf2-load-pill.high {
        border:1px solid rgba(239,68,68,.35);
        background:rgba(239,68,68,.09);
        color:#fca5a5;
      }

      .dpt-perf2-load-panel {
        margin-top:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:12px;
        padding:10px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-perf2-load-head {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
      }
      .dpt-perf2-load-title {
        font-size:10px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-perf2-load-note {
        margin-top:2px;
        font-size:8px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-perf2-load-head strong {
        font-size:11px;
        color:var(--dpt-text,#fff);
      }
      .dpt-perf2-load-track {
        height:7px;
        margin-top:8px;
        overflow:hidden;
        border-radius:999px;
        background:rgba(255,255,255,.055);
      }
      .dpt-perf2-load-fill {
        height:100%;
        border-radius:999px;
        transition:width .18s ease;
      }
      .dpt-perf2-load-fill.low { background:#22c55e; }
      .dpt-perf2-load-fill.moderate { background:#f59e0b; }
      .dpt-perf2-load-fill.high { background:#ef4444; }
      .dpt-perf2-load-detail {
        min-width:0;
        display:flex;
        justify-content:space-between;
        gap:8px;
        margin-top:6px;
        font-size:7.7px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-perf2-load-detail span {
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }

      .dpt-perf2-section-label {
        margin:13px 0 7px;
        padding-top:11px;
        border-top:1px solid var(--dpt-border,rgba(255,255,255,.07));
        font-size:8.5px;
        font-weight:900;
        letter-spacing:.7px;
        text-transform:uppercase;
        color:var(--dpt-muted,#aeb5c2);
      }

      .dpt-perf2-profile-grid {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:7px;
      }
      .dpt-perf2-profile-grid .dpt-btn {
        min-height:34px;
        font-size:9.5px;
      }

      .dpt-perf2-control-stack .dpt-row {
        border-radius:10px;
      }

      .dpt-perf2-threshold-grid {
        display:grid;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:7px;
      }
      .dpt-perf2-threshold-card {
        min-width:0;
        box-sizing:border-box;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:11px;
        padding:10px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-perf2-threshold-top {
        display:grid;
        grid-template-columns:minmax(0,1fr);
        gap:7px;
        align-items:start;
      }
      .dpt-perf2-threshold-label {
        width:100%;
        min-width:0;
        line-height:1.25;
        white-space:normal;
        font-size:9px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-perf2-threshold-value {
        width:100%;
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        align-items:center;
        gap:6px;
        min-width:0;
        font-size:7.5px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-perf2-threshold-input {
        width:100%;
        min-width:0;
        box-sizing:border-box;
        height:32px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:8px;
        padding:5px 8px;
        background:var(--dpt-surface-2,#25262b);
        color:var(--dpt-text,#fff);
        text-align:right;
        font-size:9px;
        outline:none;
      }
      .dpt-perf2-threshold-input:focus {
        border-color:var(--dpt-accent,#a855f7);
      }
      .dpt-perf2-threshold-note {
        margin-top:6px;
        font-size:7.6px;
        line-height:1.35;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-perf2-metrics {
        grid-template-columns:repeat(3,minmax(0,1fr));
        gap:7px;
        align-items:stretch;
        margin-bottom:0;
      }
      .dpt-perf2-metric {
        position:relative;
        overflow:hidden;
        min-height:0;
        height:auto;
        padding:10px 6px 11px;
        border-radius:11px;
        display:flex;
        flex-direction:column;
        justify-content:center;
        background:
          linear-gradient(180deg,rgba(255,255,255,.025),transparent),
          var(--dpt-surface,#1c1d20);
      }
      .dpt-perf2-metric:after {
        content:"";
        position:absolute;
        left:0;
        right:0;
        bottom:0;
        height:2px;
        background:var(--dpt-border,rgba(255,255,255,.08));
      }
      .dpt-perf2-metric.warn:after { background:#f59e0b; }
      .dpt-perf2-metric.danger:after { background:#ef4444; }
      .dpt-perf2-metric.accent:after { background:var(--dpt-accent,#a855f7); }
      .dpt-perf2-metric b {
        line-height:1.1;
        font-size:11px;
        font-variant-numeric:tabular-nums;
      }
      .dpt-perf2-metric span {
        line-height:1.2;
        margin-top:4px;
        font-size:7.5px;
        letter-spacing:.15px;
      }

      .dpt-perf2-action-group {
        overflow:hidden;
        margin-top:9px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.07));
        border-radius:11px;
        padding:8px;
        background:rgba(255,255,255,.018);
      }
      .dpt-perf2-action-title {
        margin-bottom:6px;
        font-size:8px;
        font-weight:900;
        letter-spacing:.55px;
        text-transform:uppercase;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-perf2-tools {
        width:100%;
        min-width:0;
        grid-template-columns:repeat(2,minmax(0,1fr));
      }
      .dpt-perf2-tools .dpt-btn {
        min-width:0;
        min-height:34px;
        padding:7px 8px;
        white-space:normal;
        line-height:1.25;
        font-size:9px;
      }


      @media (max-width:620px) {
        .dpt-perf2-threshold-grid {
          grid-template-columns:1fr;
        }
        .dpt-perf2-metrics {
          grid-template-columns:repeat(2,minmax(0,1fr));
        }
        .dpt-perf2-tools {
          grid-template-columns:1fr;
        }
      }

      @media (max-width:420px) {
        .dpt-perf2-hero {
          flex-direction:column;
        }
        .dpt-perf2-hero-pills {
          flex-direction:row;
          align-items:center;
        }
        .dpt-perf2-threshold-grid,
        .dpt-perf2-profile-grid {
          grid-template-columns:1fr;
        }
        .dpt-perf2-load-detail {
          flex-direction:column;
          gap:3px;
        }
      }


      /* v1.2.4 — Auto-Tune only activates after sustained weighted pressure. */
      html[data-dpt-perf2="1"][data-dpt-perf2-auto="1"]
      [data-list-item-id^="chat-messages___"] {
        content-visibility:auto;
        contain-intrinsic-size:auto 110px;
      }

      /* Auto-Tune deliberately avoids Discord dialogs, menus, command
         autocomplete and other floating interaction layers. */

      html[data-dpt-perf2="1"][data-dpt-perf2-auto="1"]
      [aria-busy="true"] {
        animation-duration:1.15s !important;
      }

      /* Conservative Performance+ 2.0 CSS hints. */
      html[data-dpt-perf2="1"][data-dpt-perf2-offscreen="1"]
      [data-list-item-id^="chat-messages___"] {
        content-visibility:auto;
        contain-intrinsic-size:auto 110px;
      }

      /* Compact Heavy Effects is intentionally content-scoped. Native
         Discord popout/menu/dialog rendering is never rewritten. */
      html[data-dpt-perf2="1"][data-dpt-perf2-effects="1"]
      [data-list-item-id^="chat-messages___"] [class*="shadow"] {
        box-shadow:none !important;
      }

      html[data-dpt-perf2="1"][data-dpt-perf2-effects="1"]
      [data-list-item-id^="chat-messages___"] [style*="backdrop-filter"] {
        backdrop-filter:none !important;
        -webkit-backdrop-filter:none !important;
      }

      html[data-dpt-perf2="1"][data-dpt-perf2-motion="1"][data-dpt-perf2-profile="battery"] * {
        scroll-behavior:auto !important;
      }

      html[data-dpt-perf2="1"][data-dpt-perf2-profile="battery"]
      [data-list-item-id^="chat-messages___"] img:not(:hover),
      html[data-dpt-perf2="1"][data-dpt-perf2-profile="battery"]
      [data-list-item-id^="chat-messages___"] video:not(:hover) {
        filter:saturate(.88);
      }

      html[data-dpt-perf2="1"][data-dpt-perf2-profile="balanced"][data-dpt-perf2-motion="1"]
      [aria-busy="true"] {
        animation-duration:.7s !important;
      }

      html[data-dpt-perf2="1"][data-dpt-perf2-profile="battery"][data-dpt-perf2-motion="1"]
      [aria-busy="true"] {
        animation-duration:1.2s !important;
      }


      .dpt-stable-status {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.55));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(
          135deg,
          var(--dpt-surface,#1c1d20),
          var(--dpt-surface-2,#25262b)
        );
        box-shadow:0 0 18px var(--dpt-accent-soft,rgba(168,85,247,.12));
      }
      .dpt-stable-status-title {
        font-size:12px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-stable-status-sub {
        margin-top:3px;
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-stable-pill {
        flex:0 0 auto;
        border-radius:999px;
        padding:5px 7px;
        font-size:8px;
        font-weight:900;
        letter-spacing:.45px;
      }
      .dpt-stable-pill.healthy {
        border:1px solid rgba(34,197,94,.45);
        background:rgba(34,197,94,.10);
        color:#86efac;
      }
      .dpt-stable-pill.warning {
        border:1px solid rgba(245,158,11,.45);
        background:rgba(245,158,11,.10);
        color:#fcd34d;
      }

      .dpt-stable-metrics {
        display:grid;
        grid-template-columns:repeat(3,1fr);
        gap:6px;
        margin-top:8px;
      }
      .dpt-stable-metric {
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px 4px;
        text-align:center;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-stable-metric b {
        display:block;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:10px;
        color:var(--dpt-text,#fff);
      }
      .dpt-stable-metric span {
        display:block;
        margin-top:2px;
        font-size:7.5px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-stable-health-list {
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:6px;
      }
      .dpt-stable-health-item {
        display:flex;
        align-items:center;
        gap:6px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:7px 8px;
        background:var(--dpt-surface,#1c1d20);
        font-size:9px;
        color:var(--dpt-text,#fff);
      }
      .dpt-stable-health-item.pass {
        border-color:rgba(34,197,94,.20);
      }
      .dpt-stable-health-item.fail {
        border-color:rgba(239,68,68,.30);
      }
      .dpt-stable-health-dot {
        display:grid;
        place-items:center;
        width:15px;
        height:15px;
        border-radius:50%;
        font-size:9px;
        font-weight:900;
      }
      .dpt-stable-health-item.pass .dpt-stable-health-dot {
        background:rgba(34,197,94,.14);
        color:#86efac;
      }
      .dpt-stable-health-item.fail .dpt-stable-health-dot {
        background:rgba(239,68,68,.14);
        color:#fca5a5;
      }

      .dpt-stable-actions {
        margin-top:9px;
      }
      .dpt-stable-actions .dpt-btn {
        padding:7px;
        font-size:9.5px;
      }
      .dpt-stable-note {
        margin-top:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px;
        background:rgba(255,255,255,.025);
        color:var(--dpt-muted,#9ca3af);
        font-size:8.5px;
        line-height:1.4;
      }


      .dpt-workspace-status {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.55));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(
          135deg,
          var(--dpt-surface,#1c1d20),
          var(--dpt-surface-2,#25262b)
        );
      }
      .dpt-workspace-status-title {
        font-size:12px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-workspace-status-sub {
        margin-top:3px;
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-workspace-count {
        flex:0 0 auto;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:5px 7px;
        color:var(--dpt-muted,#9ca3af);
        font-size:7.5px;
        font-weight:900;
        letter-spacing:.45px;
      }
      .dpt-workspace-note {
        margin-top:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:9px;
        padding:8px;
        background:rgba(255,255,255,.025);
        color:var(--dpt-muted,#9ca3af);
        font-size:8.5px;
        line-height:1.4;
      }

      .dpt-workspace-preset-list,
      .dpt-workspace-custom-list {
        display:grid;
        gap:6px;
      }
      .dpt-workspace-card {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:8px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-workspace-card.active,
      .dpt-workspace-custom.active {
        border-color:var(--dpt-accent,#a855f7);
        box-shadow:0 0 12px var(--dpt-accent-soft,rgba(168,85,247,.15));
      }
      .dpt-workspace-card-copy,
      .dpt-workspace-custom-copy {
        min-width:0;
        flex:1 1 auto;
      }
      .dpt-workspace-card-name,
      .dpt-workspace-custom-name {
        font-size:10.5px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-workspace-card-desc {
        margin-top:3px;
        font-size:8.5px;
        line-height:1.35;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-workspace-card > .dpt-btn {
        flex:0 0 auto;
        padding:6px 8px;
        font-size:9px;
      }

      .dpt-workspace-save-row {
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:6px;
        align-items:center;
      }
      .dpt-workspace-name-input {
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.12));
        border-radius:9px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        padding:8px 9px;
        font-size:10px;
        outline:none;
      }
      .dpt-workspace-name-input:focus {
        border-color:var(--dpt-accent,#a855f7);
      }
      .dpt-workspace-name-input::placeholder {
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-workspace-save-row .dpt-btn {
        padding:8px 9px;
        font-size:9.5px;
        white-space:nowrap;
      }

      .dpt-workspace-custom {
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:7px 7px 7px 9px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-workspace-custom-meta {
        margin-top:2px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:8px;
        color:var(--dpt-muted,#9ca3af);
      }
      .dpt-workspace-custom-actions {
        flex-wrap:wrap;
        justify-content:flex-end;
      }
      .dpt-workspace-custom-actions .dpt-btn {
        padding:5px 6px !important;
        font-size:8.5px !important;
      }

      .dpt-workspace-tools {
        margin-top:9px;
      }
      .dpt-workspace-tools .dpt-btn {
        padding:7px;
        font-size:9px;
      }


      .dpt-smart-status {
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:10px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.55));
        border-radius:12px;
        padding:10px;
        background:linear-gradient(
          135deg,
          var(--dpt-surface,#1c1d20),
          var(--dpt-surface-2,#25262b)
        );
      }
      .dpt-smart-status-title {
        font-size:12px;
        font-weight:900;
        color:var(--dpt-text,#fff);
      }
      .dpt-smart-status-sub {
        margin-top:3px;
        font-size:9px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-smart-input {
        width:100%;
        box-sizing:border-box;
        margin-top:8px;
        border:1px solid var(--dpt-border-strong,rgba(168,85,247,.45));
        border-radius:11px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        padding:10px 11px;
        font-size:11px;
        outline:none;
      }
      .dpt-smart-input:focus {
        border-color:var(--dpt-accent,#a855f7);
        box-shadow:0 0 12px var(--dpt-accent-soft,rgba(168,85,247,.15));
      }
      .dpt-smart-input::placeholder {
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-smart-filters {
        display:flex;
        flex-wrap:wrap;
        gap:5px;
        margin-top:7px;
      }
      .dpt-smart-filter {
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:5px 7px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-muted,#9ca3af);
        font:800 8px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        cursor:pointer;
      }
      .dpt-smart-filter.active {
        border-color:var(--dpt-accent,#a855f7);
        color:var(--dpt-text,#fff);
        background:var(--dpt-theme-selected,rgba(168,85,247,.14));
      }

      .dpt-smart-meta {
        margin:7px 1px 6px;
        font-size:8.5px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-smart-results {
        display:grid;
        gap:6px;
        max-height:330px;
        overflow:auto;
        overscroll-behavior:contain;
        padding-right:2px;
      }
      .dpt-smart-result {
        display:flex;
        align-items:center;
        gap:8px;
        min-width:0;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:10px;
        padding:7px;
        background:var(--dpt-surface,#1c1d20);
      }
      .dpt-smart-result:hover {
        border-color:var(--dpt-border-strong,rgba(168,85,247,.45));
        background:var(--dpt-theme-hover,rgba(255,255,255,.05));
      }
      .dpt-smart-result-icon {
        flex:0 0 auto;
        display:grid;
        place-items:center;
        width:25px;
        height:25px;
        border:1px solid var(--dpt-border,rgba(255,255,255,.08));
        border-radius:8px;
        background:var(--dpt-surface-2,#25262b);
        color:var(--dpt-accent,#a855f7);
        font-size:12px;
        font-weight:900;
      }
      .dpt-smart-result-copy {
        min-width:0;
        flex:1 1 auto;
      }
      .dpt-smart-result-head {
        display:flex;
        align-items:center;
        gap:6px;
        min-width:0;
      }
      .dpt-smart-result-title {
        min-width:0;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:10.5px;
        font-weight:850;
        color:var(--dpt-text,#fff);
      }
      .dpt-smart-result-type {
        flex:0 0 auto;
        border-radius:999px;
        padding:3px 5px;
        background:var(--dpt-accent-soft,rgba(168,85,247,.12));
        color:var(--dpt-accent,#a855f7);
        font-size:7px;
        font-weight:900;
        letter-spacing:.35px;
        text-transform:uppercase;
      }
      .dpt-smart-result-sub {
        margin-top:2px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        font-size:8.5px;
        color:var(--dpt-muted,#9ca3af);
      }

      .dpt-smart-recent-queries {
        display:flex;
        flex-wrap:wrap;
        gap:5px;
      }
      .dpt-smart-query-chip {
        max-width:145px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        border:1px solid var(--dpt-border,rgba(255,255,255,.10));
        border-radius:999px;
        padding:5px 7px;
        background:var(--dpt-surface,#1c1d20);
        color:var(--dpt-text,#fff);
        font:700 8px/1 Inter,ui-sans-serif,system-ui,sans-serif;
        cursor:pointer;
      }
      .dpt-smart-query-chip:hover {
        border-color:var(--dpt-accent,#a855f7);
      }
      .dpt-smart-query-empty {
        color:var(--dpt-muted,#9ca3af);
        font-size:8.5px;
      }
      .dpt-smart-tools {
        margin-top:8px;
      }
      .dpt-smart-tools .dpt-btn {
        padding:7px;
        font-size:9px;
      }

      .dpt-foot { font-size:10px; color:var(--dpt-muted,#7f8791); padding:10px 15px 13px; }

      #dpt-toast {
        position:fixed; left:50%; bottom:30px; z-index:2147483647;
        transform:translate(-50%,12px);
        opacity:0; pointer-events:none;
        background:var(--dpt-bg,#111214);
        color:var(--dpt-text,#fff);
        border:1px solid var(--dpt-border-strong,rgba(255,255,255,.12));
        border-radius:10px;
        padding:9px 13px;
        font-size:12px;
        transition:.15s;
      }
      #dpt-toast.show { opacity:1; transform:translate(-50%,0); }

      html[data-dpt-compact="1"] #dpt-panel .dpt-section { padding-top:9px; padding-bottom:9px; }
      html[data-dpt-compact="1"] #dpt-panel .dpt-row { padding:5px 0; }
      html[data-dpt-compact="1"] #dpt-panel .dpt-control-block { padding:5px 0; }
      html[data-dpt-compact="1"] #dpt-panel .dpt-row-note { display:none; }

      @media (max-width:520px) {
        #dpt-panel { max-width:calc(100vw - 20px); }
        .dpt-theme-grid { grid-template-columns:repeat(2,1fr); }
        .dpt-tabs { top:67px; padding-left:8px; padding-right:8px; }
        .dpt-tab-button { padding:7px 8px; }
      }
    `;

    (document.head || document.documentElement).appendChild(style);
  }

  function buildUI() {
    if (!document.body) return;
    if (uiBuilt || document.getElementById('dpt-panel') || document.getElementById('dpt-launcher')) {
      uiBuilt = true;
      return;
    }

    uiBuilt = true;
    injectUIStyle();
    applyThemeVariables();

    launcher = el('button', {
      id: 'dpt-launcher',
      type: 'button',
      'aria-controls': 'dpt-panel',
      'aria-expanded': 'false',
      title: 'Discord PowerTools — drag to move, click to open',
      'aria-label': 'Discord PowerTools'
    }, [
      el('img', {
        class: 'dpt-launcher-icon',
        src: POWERTOOLS_ICON,
        alt: ''
      })
    ]);

    const header = el('div', { class: 'dpt-head' }, [
      el('div', { class: 'dpt-title' }, [
        el('div', {}, [
          el('strong', { text: 'Discord PowerTools' }),
          el('div', { class: 'dpt-version', text: `v${VERSION} • Reliability & Accessibility` })
        ]),
        el('button', { class: 'dpt-close', type: 'button', text: '×', title: 'Close', 'aria-label': 'Close PowerTools' })
      ])
    ]);

    panel = el('div', { id: 'dpt-panel', role: 'region', 'aria-label': 'Discord PowerTools dashboard', hidden: 'hidden' }, [
      header,

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Core' }),
        toggleRow('PowerTools Enabled', 'enabled', 'Master switch for PowerTools effects.'),
        toggleRow('Performance+', 'performancePlus', 'Lightweight DOM/media optimizations and reduced rendering overhead.')
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Workspace Profiles' }),
        el('div', {
          'data-workspace-profiles': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Smart Search & Jump Center' }),
        el('div', {
          'data-smart-search-center': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Server & Channel PowerTools' }),
        el('div', {
          'data-server-channel-studio': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Message Utilities' }),
        el('div', {
          'data-message-utilities': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Media & Attachment Tools' }),
        el('div', {
          'data-media-attachment-tools': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Focus & Productivity Center' }),
        el('div', {
          'data-focus-productivity': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Nitro Cosmetic Preview' }),
        el('div', {
          'data-nitro-cosmetic-preview': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Notification Control' }),
        el('div', {
          'data-notification-control': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Privacy & Tracking Control' }),
        el('div', {
          'data-privacy-tracking-control': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Performance+ 2.0' }),
        el('div', {
          'data-performance2-center': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Stable Release Center' }),
        el('div', {
          'data-stable-release-center': '1'
        })
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Theme Studio' }),
        themePicker(),

        el('div', { class: 'dpt-preview' }, [
          el('div', { class: 'dpt-preview-title', text: 'Theme Preview' }),
          el('div', {
            class: 'dpt-preview-sub',
            'data-active-theme': '1',
            text: `Active: ${getTheme().name}`
          }),
          el('div', { class: 'dpt-preview-bar' })
        ]),

        toggleRow(
          'Apply Theme to Discord',
          'themeDiscord',
          'Optional Discord-wide tint. PowerTools theme works independently when this is off.'
        ),
        toggleRow(
          'Launcher Glow',
          'launcherGlow',
          'Accent glow around the Purple Dragon launcher.'
        )
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Interface Studio' }),
        toggleRow(
          'Compact Panel',
          'compactPanel',
          'Reduces spacing for a denser PowerTools panel.'
        ),
        rangeRow(
          'Panel Width',
          'panelWidth',
          320, 460, 10, 'px',
          'Adjust the PowerTools panel width.'
        ),
        rangeRow(
          'Panel Opacity',
          'panelOpacity',
          75, 100, 1, '%',
          'Adjust PowerTools surface opacity.'
        ),
        rangeRow(
          'Launcher Size',
          'launcherSize',
          42, 76, 2, 'px',
          'Resize the draggable Purple Dragon launcher.'
        ),
        selectRow(
          'FPS Badge Position',
          'fpsPosition',
          [
            ['top-right', 'Top Right'],
            ['top-center', 'Top Center / Discord Header'],
            ['top-left', 'Top Left'],
            ['bottom-right', 'Bottom Right'],
            ['bottom-left', 'Bottom Left']
          ],
          'Choose the FPS badge position. Top Center places it over Discord’s centered header area.'
        ),
        el('div', { class: 'dpt-grid', style: 'margin-top:8px' }, [
          button('Reset Theme Studio', resetThemeStudio),
          button('Copy Theme Config', () => copyText(JSON.stringify({
            theme: settings.uiTheme,
            discordTint: settings.themeDiscord,
            compactPanel: settings.compactPanel,
            panelWidth: settings.panelWidth,
            panelOpacity: settings.panelOpacity,
            launcherSize: settings.launcherSize,
            launcherGlow: settings.launcherGlow,
            fpsPosition: settings.fpsPosition
          }, null, 2)))
        ])
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Performance+' }),
        toggleRow('Reduce Motion', 'reducedMotion', 'Cuts most transition and animation overhead.'),
        toggleRow('Disable Blur', 'disableBlur', 'Reduces blur inside message content only; Discord menus/popouts stay native.'),
        toggleRow('Lighter Shadows', 'lighterShadows', 'Reduces message-content shadows without modifying Discord modals or popouts.'),
        toggleRow('Compact Effects', 'compactEffects', 'Suppresses decorative message-area effects without touching Discord popups.'),
        toggleRow('FPS Meter', 'fpsMeter', 'High-refresh aware; no artificial 60 FPS clamp.')
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Quick Tools' }),
        el('div', { class: 'dpt-grid' }, [
          button('Copy Page Link', () => copyText(location.href)),
          button('Open DMs', () => location.assign('https://discord.com/channels/@me')),
          button('Reload Discord', () => location.reload()),
          button('Reset Settings', () => {
            settings = { ...defaults };
            saveSettings();
            applySettings();
            updateUI();
            restorePanelPosition();
            restoreLauncherPosition();
            toast('PowerTools settings reset');
          }, true)
        ])
      ]),

      el('div', { class: 'dpt-section' }, [
        el('div', { class: 'dpt-section-title', text: 'Live Diagnostics' }),
        el('div', { class: 'dpt-stats' }, [
          el('div', { class: 'dpt-stat' }, [
            el('b', { 'data-stat': 'dom', text: '—' }),
            el('span', { text: 'DOM nodes' })
          ]),
          el('div', { class: 'dpt-stat' }, [
            el('b', { 'data-stat': 'mem', text: '—' }),
            el('span', { text: 'JS memory' })
          ]),
          el('div', { class: 'dpt-stat' }, [
            el('b', { 'data-stat': 'fps', text: 'Off' }),
            el('span', { text: 'FPS meter' })
          ])
        ])
      ]),

      el('div', {
        class: 'dpt-foot',
        text: 'Created by KyleAustin85 • Overlay Compatibility Rebuild • Native Discord popouts protected • No token access'
      })
    ]);

    document.body.append(launcher, panel);
    buildDashboardTabs();
    markStableBootComplete();

    ensureFPSBadge();
    ensureFocusBadge();
    updateFocusBadge();
    ensureNotificationBadge();
    updateNotificationBadge();
    ensurePrivacyBadge();
    updatePrivacyBadge();
    ensurePerformance2Badge();
    updatePerformance2Badge();
    if (settings.enabled && settings.fpsMeter) startFPS();

    launcher.addEventListener('click', e => {
      if (launcher.dataset.justDragged === '1') {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      panel.hidden = !panel.hidden;
      launcher.setAttribute('aria-expanded', String(!panel.hidden));

      if (!panel.hidden) {
        restorePanelPosition();
        updateUI();
        setDashboardTab(dashboardActiveTab, { scroll: false, instant: true });
        updateStats();
        panel.querySelector('[role="tab"][aria-selected="true"]')?.focus();
      }
    });

    panel.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      event.stopPropagation();
      panel.hidden = true;
      launcher.setAttribute('aria-expanded', 'false');
      launcher.focus();
    });

    header.querySelector('.dpt-close').addEventListener('click', () => {
      panel.hidden = true;
      launcher.setAttribute('aria-expanded', 'false');
      launcher.focus();
    });

    makeLauncherDraggable();
    restoreLauncherPosition();

    makeDraggable(header);
    restorePanelPosition();
    updateUI();

    clearInterval(statsTimer);
    statsTimer = setInterval(() => {
      if (panel && !panel.hidden && dashboardActiveTab === 'diagnostics') {
        updateStats();
      }
    }, 3000);
  }

  function updateUI() {
    applyThemeVariables();

    if (!panel) return;

    panel.querySelectorAll('[data-setting]').forEach(row => {
      const key = row.dataset.setting;
      const input = row.querySelector('input[type="checkbox"]');
      if (input) input.checked = !!settings[key];
    });

    panel.querySelectorAll('[data-theme-id]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.themeId === settings.uiTheme);
    });

    panel.querySelectorAll('[data-range-setting]').forEach(input => {
      const key = input.dataset.rangeSetting;
      if (key in settings) input.value = String(settings[key]);
    });

    panel.querySelectorAll('[data-range-value]').forEach(value => {
      const key = value.dataset.rangeValue;
      const suffix = value.dataset.suffix || '';
      if (key in settings) value.textContent = `${settings[key]}${suffix}`;
    });

    panel.querySelectorAll('[data-select-setting]').forEach(select => {
      const key = select.dataset.selectSetting;
      if (key in settings) select.value = String(settings[key]);
    });

    const activeTheme = panel.querySelector('[data-active-theme]');
    if (activeTheme) activeTheme.textContent = `Active: ${getTheme().name}`;

    const activeRenderer = {
      workspaces: renderWorkspaceProfiles,
      search: renderSmartSearchCenter,
      servers: renderServerChannelStudio,
      messages: renderMessageUtilities,
      media: renderMediaAttachmentTools,
      focus: renderFocusProductivityCenter,
      nitro: renderNitroCosmeticPreview,
      notifications: renderNotificationControl,
      privacy: renderPrivacyTrackingControl,
      performance2: renderPerformance2Center,
      stable: renderStableReleaseCenter
    }[dashboardActiveTab];

    if (typeof activeRenderer === 'function') {
      safeRender(`Tab: ${dashboardActiveTab}`, activeRenderer);
    }

    updateStats();
  }

  document.addEventListener('visibilitychange', () => {
    if (settings.enabled && settings.fpsMeter) {
      if (document.hidden) {
        publishFPS('FPS: paused');
      } else {
        // Restart sampling so a long hidden-tab gap cannot corrupt the displayed value.
        if (fpsHandle) cancelAnimationFrame(fpsHandle);
        fpsHandle = 0;
        fpsPrevFrame = 0;
        fpsSamples = [];
        startFPS();
        trackCurrentDiscordRoute(true);
      }
    }
  });

  function boot() {
    if (bootStarted) return;
    bootStarted = true;

    registerStableBoot();
    applySettings();
    startRouteTracker();
    installMessagePicker();
    installFocusShortcut();
    installSmartSearchShortcut();
    startFocusTicker();
    startNotificationTicker();
    startPerformance2Ticker();

    const startUI = () => {
      if (document.body) {
        try {
          buildUI();
        } catch (error) {
          recordRuntimeIssue('UI boot', error);
          uiBuilt = false;
        }
      } else {
        setTimeout(startUI, 50);
      }
    };

    startUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
    // Performance CSS can still be installed before DOMContentLoaded.
    if (document.documentElement) applySettings();
  } else {
    boot();
  }
})();
