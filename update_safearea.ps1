$files = @(
    "c:\dev\HairClipper\src\screens\DIYMakeupScreen.tsx",
    "c:\dev\HairClipper\src\screens\DIYMakeupCameraScreen.tsx", 
    "c:\dev\HairClipper\src\screens\DIYMakeupEditScreen.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Add useSafeAreaInsets import
        $content = $content -replace "} from 'react-native';", "} from 'react-native';`nimport { useSafeAreaInsets } from 'react-native-safe-area-context';"
        
        # Add insets variable
        $content = $content -replace "(const \w+Screen: React\.FC = \(\) => \{[^}]*const navigation = useNavigation\(\);)", "`$1`n  const insets = useSafeAreaInsets();"
        
        # Replace SafeAreaView with View
        $content = $content -replace "<SafeAreaView style=\{styles\.safeArea\}>", "<View style={[styles.safeArea, { paddingTop: insets.top }]}>"
        $content = $content -replace "</SafeAreaView>", "</View>"
        
        Set-Content $file $content
        Write-Host "Updated: $file"
    }
}