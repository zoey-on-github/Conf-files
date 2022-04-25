# free-omnisharp-vscode

The debugger included in the official C# extension is [proprietary](https://aka.ms/VSCode-DotNet-DbgLicense) and is licensed to only work with Microsoft versions of vscode.
This extension replaces it with [Samsung's MIT-licensed alternative](https://github.com/Samsung/netcoredbg/blob/master/LICENSE).

## Installation

This extension is published at [open-vsx.org](https://open-vsx.org/extension/muhammad-sammy/csharp).

### Build from source

Requirements:

- [nodejs](https://nodejs.org)
- npm (comes with nodejs)

```bash
git clone https://github.com/muhammadsammy/free-omnisharp-vscode.git

cd free-omnisharp-vscode

npm install

npx gulp 'vsix:release:package'

```

then run `Extensions: Install from VSIX` from the command pallete and select the `csharp-VERSION_NUMBER.vsix` file.

# From [OmniSharp/omnisharp-vscode](https://github.com/OmniSharp/omnisharp-vscode) README

## Using .NET 6 builds of OmniSharp

Starting with C# extension version 1.24.0, there is now an option to use build of OmniSharp that runs on the .NET 6 SDK. This build requires that the .NET 6 SDK be installed and does not use Visual Studio MSBuild tools or Mono. It only supports newer SDK-style projects that are buildable with `dotnet build`. Unity projects and other Full Framework projects are not supported.

To use the .NET 6 build, set `omnisharp.useModernNet` to `true` in your VS Code settings and restart OmniSharp.

## Note about using .NET Core 3.1.4xx SDKs

The .NET 3.1.4xx SDKs require version 16.7 of MSBuild.

For MacOS and Linux users who have Mono installed, this means you will need to set `omnisharp.useGlobalMono` to `never` until a version of Mono ships with MSBuild 16.7.

You can also use the .NET 6 build of OmniSharp which runs on the .NET 6 SDK. See instructions above.

## Note about using .NET 5 SDKs

The .NET 5 SDK requires version 16.8 of MSBuild.

For Windows users who have Visual Studio installed, this means you will need to be on the latest Visual Studio 16.8 Preview.

For MacOS and Linux users who have Mono installed, this means you will need to set `omnisharp.useGlobalMono` to `never` until a version of Mono ships with MSBuild 16.8.

You can also use the .NET 6 build of OmniSharp which runs on the .NET 6 SDK. See instructions above.

## Note about using .NET 6 SDKs

The .NET 6 SDK requires version 16.10 of MSBuild.

For Windows users who have Visual Studio installed, this means you will need to have Visual Studio 16.11 or newer installed.

For MacOS and Linux users who have Mono installed, this means you will need to set `omnisharp.useGlobalMono` to `never` until a version of Mono ships with MSBuild 16.10.

You can also use the .NET 6 build of OmniSharp which runs on the .NET 6 SDK. See instructions above.

### Emmet support in Razor files

To enable emmet support, add the following to your settings.json:

```json
"emmet.includeLanguages": {
    "aspnetcorerazor": "html"
}
```

### Semantic Highlighting

The C# semantic highlighting support is in preview. To enable, set `editor.semanticHighlighting.enabled` and `csharp.semanticHighlighting.enabled` to `true` in your settings. Semantic highlighting is only provided for code files that are part of the active project.

To really see the difference, try the new Visual Studio 2019 Light and Dark themes with semantic colors that closely match Visual Studio 2019.

### Development

First install:

- Node.js (8.11.1 or later)
- Npm (5.6.0 or later)

To **run and develop** do the following:

- Run `npm i`
- Run `npm run compile`
- Open in Visual Studio Code (`code .`)
- _Optional:_ run `npm run watch`, make code changes
- Press <kbd>F5</kbd> to debug

To **test** do the following: `npm run test` or <kbd>F5</kbd> in VS Code with the "Launch Tests" debug configuration.
